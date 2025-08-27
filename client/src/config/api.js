// API configuration for different environments
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api'  // Vercel serverless functions
  : 'https://client-4ek3fnn3c-jonathon-es-projects.vercel.app/api';  // Use production API for local dev

export default API_BASE;