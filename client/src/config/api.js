// API configuration for different environments
const API_BASE = process.env.NODE_ENV === 'production' 
  ? ''  // Use relative paths for Vercel serverless functions
  : 'https://client-pabqcq9la-jonathon-es-projects.vercel.app';  // Use current production API for local dev

export default API_BASE;