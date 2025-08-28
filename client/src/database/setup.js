import { supabase } from '../supabase.js';

// SQL for creating the users table in Supabase
export const createUsersTable = async () => {
  const { data, error } = await supabase.rpc('create_users_table');
  
  if (error) {
    console.error('Error creating users table:', error);
    return false;
  }
  
  console.log('Users table created successfully');
  return true;
};

// Initialize test users in Supabase
export const initializeTestUsers = async () => {
  const testUsers = [
    {
      username: 'testpro',
      email: 'testpro@example.com',
      password_hash: '$2b$10$example_hashed_password', // In production, properly hash passwords
      tier: 'pro',
      subscription_status: 'active',
      stripe_customer_id: 'cus_testpro123',
      created_at: new Date().toISOString()
    },
    {
      username: 'Joehonathon', 
      email: 'joehonathon@gmail.com',
      password_hash: '$2b$10$example_hashed_password2',
      tier: 'pro',
      subscription_status: 'active',
      stripe_customer_id: null,
      created_at: new Date().toISOString()
    },
    {
      username: 'testuser',
      email: 'test@example.com', 
      password_hash: '$2b$10$example_hashed_password3',
      tier: 'free',
      subscription_status: 'inactive',
      stripe_customer_id: null,
      created_at: new Date().toISOString()
    }
  ];

  for (const user of testUsers) {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', user.email)
      .single();
    
    if (!existingUser) {
      const { data, error } = await supabase
        .from('users')
        .insert([user]);
      
      if (error) {
        console.error(`Error creating user ${user.email}:`, error);
      } else {
        console.log(`Created user: ${user.email} (${user.tier})`);
      }
    } else {
      console.log(`User ${user.email} already exists`);
    }
  }
};

// Helper function to get user by email or username
export const getUserByEmailOrUsername = async (emailOrUsername) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
    .single();
  
  return { data, error };
};

// Helper function to update user tier
export const updateUserTier = async (userId, tier, subscriptionStatus = 'active') => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      tier, 
      subscription_status: subscriptionStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  return { data, error };
};

// Helper function to create new user
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      ...userData,
      tier: 'free', // New users start as free
      subscription_status: 'inactive',
      created_at: new Date().toISOString()
    }])
    .select()
    .single();
  
  return { data, error };
};