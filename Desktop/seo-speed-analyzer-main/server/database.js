const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));
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
        subscription_status TEXT DEFAULT 'inactive'
      )
    `);

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
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

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

  async getProjectReports(projectId, limit = 10) {
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
}

module.exports = new Database();