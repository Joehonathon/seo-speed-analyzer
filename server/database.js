const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    this.init();
  }

  init() {
    // Users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        tier TEXT DEFAULT 'free',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        stripe_customer_id TEXT,
        subscription_status TEXT DEFAULT 'inactive',
        google_pagespeed_api_key TEXT
      )
    `);

    // Migration: Add google_pagespeed_api_key column if it doesn't exist
    this.db.run(`
      ALTER TABLE users ADD COLUMN google_pagespeed_api_key TEXT
    `, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Migration error:', err);
      } else if (!err) {
        console.log('Migration: Added google_pagespeed_api_key column to users table');
      }
    });

    // Usage tracking table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        date DATE,
        reports_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, date)
      )
    `);

    // Projects table for Pro users
    this.db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_scan DATETIME,
        last_seo_score INTEGER,
        last_speed_time INTEGER,
        last_issues_count INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Add new columns to existing projects table (for existing databases)
    this.db.run(`ALTER TABLE projects ADD COLUMN last_seo_score INTEGER`, (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.log('Note: last_seo_score column may already exist');
      }
    });
    
    this.db.run(`ALTER TABLE projects ADD COLUMN last_speed_time INTEGER`, (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.log('Note: last_speed_time column may already exist');
      }
    });
    
    this.db.run(`ALTER TABLE projects ADD COLUMN last_issues_count INTEGER`, (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.log('Note: last_issues_count column may already exist');
      }
    });

    // SEO reports history table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS seo_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        project_id INTEGER,
        url TEXT NOT NULL,
        report_data TEXT,
        score INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )
    `);
  }

  // User management
  async createUser(username, email, password) {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, 10);
      this.db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async getUserByEmailOrUsername(emailOrUsername) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [emailOrUsername, emailOrUsername],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // Usage tracking
  async getTodayUsage(userId) {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0];
      this.db.get(
        'SELECT reports_count FROM usage_logs WHERE user_id = ? AND date = ?',
        [userId, today],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? row.reports_count : 0);
        }
      );
    });
  }

  async incrementUsage(userId) {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0];
      this.db.run(
        `INSERT INTO usage_logs (user_id, date, reports_count) 
         VALUES (?, ?, 1) 
         ON CONFLICT(user_id, date) 
         DO UPDATE SET reports_count = reports_count + 1`,
        [userId, today],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  // Project management
  async createProject(userId, name, url) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO projects (user_id, name, url) VALUES (?, ?, ?)',
        [userId, name, url],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getUserProjects(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async deleteProject(projectId, userId) {
    return new Promise((resolve, reject) => {
      // First delete associated reports
      this.db.run(
        'DELETE FROM seo_reports WHERE project_id = ? AND user_id = ?',
        [projectId, userId],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          // Then delete the project
          this.db.run(
            'DELETE FROM projects WHERE id = ? AND user_id = ?',
            [projectId, userId],
            function(err) {
              if (err) reject(err);
              else resolve(this.changes > 0);
            }
          );
        }
      );
    });
  }

  // SEO reports
  async saveReport(userId, projectId, url, reportData, score) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO seo_reports (user_id, project_id, url, report_data, score) VALUES (?, ?, ?, ?, ?)',
        [userId, projectId, url, JSON.stringify(reportData), score],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async saveProjectReport(userId, projectId, url, seoData, speedData) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Database: Saving report for user ${userId}, project ${projectId}`);
        
        // Create combined report data
        const reportData = {
          seo: seoData,
          speed: speedData,
          timestamp: new Date().toISOString()
        };
        
        console.log('Database: Report data structure created');
        
        // Save the report
        const reportId = await new Promise((res, rej) => {
          this.db.run(
            'INSERT INTO seo_reports (user_id, project_id, url, report_data, score) VALUES (?, ?, ?, ?, ?)',
            [userId, projectId, url, JSON.stringify(reportData), seoData?.score || 0],
            function(err) {
              if (err) {
                console.error('Database: Failed to insert report:', err);
                rej(err);
              } else {
                console.log(`Database: Report inserted with ID ${this.lastID}`);
                res(this.lastID);
              }
            }
          );
        });

        // Clean up old reports - keep only last 5 per project
        const deletedCount = await new Promise((res, rej) => {
          this.db.run(
            `DELETE FROM seo_reports 
             WHERE project_id = ? 
             AND id NOT IN (
               SELECT id FROM seo_reports 
               WHERE project_id = ? 
               ORDER BY created_at DESC 
               LIMIT 6
             )`,
            [projectId, projectId],
            function(err) {
              if (err) {
                console.error('Database: Failed to clean old reports:', err);
                rej(err);
              } else {
                console.log(`Database: Cleaned up ${this.changes} old reports for project ${projectId}`);
                res(this.changes);
              }
            }
          );
        });

        // Update project with latest metrics
        const seoScore = seoData?.score || null;
        
        // Extract speed time using same logic as frontend
        const getSpeedTime = (speedData) => {
          if (!speedData) return null;
          
          // If using PageSpeed API, try to extract a meaningful timing metric
          if (speedData.usingPageSpeedAPI && speedData.metrics) {
            // Try Load time first (full page load)
            if (speedData.metrics.Load) {
              const loadMatch = speedData.metrics.Load.match(/(\d+(?:\.\d+)?)/);
              if (loadMatch) {
                const value = parseFloat(loadMatch[1]);
                // Convert seconds to milliseconds if needed
                return speedData.metrics.Load.includes('s') ? Math.round(value * 1000) : Math.round(value);
              }
            }
            
            // Fallback to Time to Interactive (TTI)
            if (speedData.metrics.TTI) {
              const ttiMatch = speedData.metrics.TTI.match(/(\d+(?:\.\d+)?)/);
              if (ttiMatch) {
                const value = parseFloat(ttiMatch[1]);
                // Convert seconds to milliseconds if needed
                return speedData.metrics.TTI.includes('s') ? Math.round(value * 1000) : Math.round(value);
              }
            }
            
            // Fallback to First Contentful Paint (FCP)
            if (speedData.metrics.FCP) {
              const fcpMatch = speedData.metrics.FCP.match(/(\d+(?:\.\d+)?)/);
              if (fcpMatch) {
                const value = parseFloat(fcpMatch[1]);
                return speedData.metrics.FCP.includes('s') ? Math.round(value * 1000) : Math.round(value);
              }
            }
          }
          
          // Fallback to basic timing (when PageSpeed API is not used)
          return speedData.basic?.timeMs || null;
        };
        
        const speedTime = getSpeedTime(speedData);
        const issuesCount = ((seoData?.freeIssues?.length || 0) + (seoData?.proIssues?.length || 0)) || null;
        
        console.log(`Database: Extracted metrics - SEO: ${seoScore}, Speed: ${speedTime}ms, Issues: ${issuesCount}`);
        
        await this.updateProjectMetrics(projectId, seoScore, speedTime, issuesCount);

        console.log(`Database: Report save completed successfully with ID ${reportId}`);
        resolve(reportId);
      } catch (err) {
        console.error('Database: Error in saveProjectReport:', err);
        reject(err);
      }
    });
  }

  async getProjectReports(projectId, limit = 6) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM seo_reports WHERE project_id = ? ORDER BY created_at DESC LIMIT ?',
        [projectId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows.map(row => ({
            ...row,
            report_data: JSON.parse(row.report_data)
          })));
        }
      );
    });
  }

  async updateProjectMetrics(projectId, seoScore, speedTime, issuesCount) {
    return new Promise((resolve, reject) => {
      console.log(`Database: Updating project ${projectId} metrics - SEO: ${seoScore}, Speed: ${speedTime}ms, Issues: ${issuesCount}`);
      
      this.db.run(
        `UPDATE projects 
         SET last_scan = CURRENT_TIMESTAMP,
             last_seo_score = ?,
             last_speed_time = ?,
             last_issues_count = ?
         WHERE id = ?`,
        [seoScore, speedTime, issuesCount, projectId],
        function(err) {
          if (err) {
            console.error('Database: Failed to update project metrics:', err);
            reject(err);
          } else {
            console.log(`Database: Updated project ${projectId} with latest metrics`);
            resolve(this.changes);
          }
        }
      );
    });
  }

  async getAllProjectReportsForUser(userId) {
    return new Promise((resolve, reject) => {
      console.log(`Database: Querying all reports for user ${userId}`);
      
      this.db.all(
        `SELECT sr.*, p.name as project_name, p.url as project_url 
         FROM seo_reports sr 
         JOIN projects p ON sr.project_id = p.id 
         WHERE sr.user_id = ? 
         ORDER BY sr.created_at DESC
         LIMIT 6`,
        [userId],
        (err, rows) => {
          if (err) {
            console.error('Database: Error querying reports:', err);
            reject(err);
          } else {
            console.log(`Database: Found ${rows.length} reports for user ${userId}`);
            const parsedRows = rows.map(row => ({
              ...row,
              report_data: JSON.parse(row.report_data)
            }));
            resolve(parsedRows);
          }
        }
      );
    });
  }

  // Update user tier
  async updateUserTier(userId, tier) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE users SET tier = ? WHERE id = ?',
        [tier, userId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  // API Key encryption/decryption functions
  encryptApiKey(apiKey) {
    if (!apiKey) return null;
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  decryptApiKey(encryptedApiKey) {
    if (!encryptedApiKey) return null;
    try {
      const algorithm = 'aes-256-cbc';
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      const textParts = encryptedApiKey.split(':');
      const iv = Buffer.from(textParts.shift(), 'hex');
      const encryptedText = textParts.join(':');
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('Failed to decrypt API key:', error);
      return null;
    }
  }

  // Google PageSpeed API key management
  async savePageSpeedApiKey(userId, apiKey) {
    return new Promise((resolve, reject) => {
      const encryptedKey = this.encryptApiKey(apiKey);
      this.db.run(
        'UPDATE users SET google_pagespeed_api_key = ? WHERE id = ?',
        [encryptedKey, userId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  async getPageSpeedApiKey(userId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT google_pagespeed_api_key FROM users WHERE id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else {
            const decryptedKey = row?.google_pagespeed_api_key 
              ? this.decryptApiKey(row.google_pagespeed_api_key)
              : null;
            resolve(decryptedKey);
          }
        }
      );
    });
  }

  async deletePageSpeedApiKey(userId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE users SET google_pagespeed_api_key = NULL WHERE id = ?',
        [userId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  // Get masked API key for display purposes (show first 4 and last 4 characters)
  getMaskedApiKey(apiKey) {
    if (!apiKey || apiKey.length < 8) return null;
    return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
  }
}

module.exports = new Database();