// Projects API endpoint for pro users
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvggpdyxpmuuhydtavii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Z2dwZHl4cG11dWh5ZHRhdmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTY3NzcsImV4cCI6MjA3MVg5Mjc3N30.pkmrkEDNMCDSEvVS9cIGhou2SNqGDDoSdkANtUtfmKw';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Extract user ID from token (simplified for demo)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const userId = token.replace('mock-jwt-token-', '');

    // Verify user exists and is pro
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('tier, subscription_status')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    if (user.tier !== 'pro') {
      return res.status(403).json({ error: 'Pro subscription required for project management' });
    }

    switch (req.method) {
      case 'GET':
        return await getProjects(req, res, userId);
      case 'POST':
        return await createProject(req, res, userId);
      case 'PUT':
        return await updateProject(req, res, userId);
      case 'DELETE':
        return await deleteProject(req, res, userId);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Projects API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getProjects(req, res, userId) {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }

  res.status(200).json(projects || []);
}

async function createProject(req, res, userId) {
  const { name, url } = req.body;

  if (!name?.trim() || !url?.trim()) {
    return res.status(400).json({ error: 'Project name and URL are required' });
  }

  // Validate URL format
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

  const { data: project, error } = await supabase
    .from('projects')
    .insert([{
      user_id: userId,
      name: name.trim(),
      url: normalizedUrl,
      created_at: new Date().toISOString(),
      last_scan: null,
      scan_count: 0
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }

  res.status(201).json(project);
}

async function updateProject(req, res, userId) {
  const { id } = req.query;
  const { name, url } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Project ID required' });
  }

  const updateData = {};
  if (name?.trim()) updateData.name = name.trim();
  if (url?.trim()) {
    try {
      updateData.url = url.startsWith('http') ? url : `https://${url}`;
      new URL(updateData.url); // Validate URL
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  updateData.updated_at = new Date().toISOString();

  const { data: project, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ error: 'Failed to update project' });
  }

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.status(200).json(project);
}

async function deleteProject(req, res, userId) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Project ID required' });
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ error: 'Failed to delete project' });
  }

  res.status(200).json({ message: 'Project deleted successfully' });
}