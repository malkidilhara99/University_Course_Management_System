// Central API base URL with environment-specific defaults
// Can be overridden with the environment variable REACT_APP_API_BASE
const getApiBase = () => {
  // If explicitly set via environment variable, use that
  if (process.env.REACT_APP_API_BASE) {
    return process.env.REACT_APP_API_BASE;
  }

  // For GitHub Pages deployment
  if (window.location.hostname === 'malkidilhara99.github.io') {
    // You can change this to your actual backend URL when deployed
    return 'http://api.university-cms.example';
  }

  // For Netlify deployment
  if (window.location.hostname.includes('netlify.app')) {
    // Replace with your actual Railway backend URL once deployed
    return 'https://university-cms-backend.up.railway.app';
  }

  // Default for local development
  return 'http://localhost:8080';
};

const API_BASE = getApiBase();

export default API_BASE;
