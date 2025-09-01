// Central API base URL. Can be overridden with the environment variable
// REACT_APP_API_BASE when starting the frontend (create-react-app behavior).
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

export default API_BASE;
