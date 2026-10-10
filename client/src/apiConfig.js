// Centralized API Base URL Resolver
export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // In production on Firebase Hosting or any custom domain, use relative same-origin /api
    const host = window.location.hostname;
    if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
      return '';
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:4000';
};

export const API = getApiUrl();
export default API;
