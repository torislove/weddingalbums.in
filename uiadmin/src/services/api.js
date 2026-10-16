/**
 * uiadmin/src/services/api.js
 * Centralized, resilient API service layer for Visual CMS & Content Admin.
 * Automatically attaches the Bearer token and handles 401 → refresh token flow.
 */
import { API } from '../apiConfig';

const getToken = () => localStorage.getItem('uiadminToken') || localStorage.getItem('adminToken') || localStorage.getItem('token');

export const refreshAccessToken = async () => {
  const res = await fetch(`${API}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Session expired');
  const { token } = await res.json();
  localStorage.setItem('uiadminToken', token);
  return token;
};

/**
 * Main request helper with 401 auto-refresh and retry.
 */
export const request = async (path, options = {}, retry = true) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = path.startsWith('http') ? path : `${API}${path}`;
  const res = await fetch(url, { ...options, headers, credentials: 'include' });

  if (res.status === 401 && retry) {
    try {
      const newToken = await refreshAccessToken();
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newToken}`
      };
      return request(path, { ...options, headers: retryHeaders }, false);
    } catch {
      localStorage.removeItem('uiadminToken');
      localStorage.removeItem('uiAdminUser');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
      return null;
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const api = {
  get:    (path, opts)    => request(path, { method: 'GET', ...opts }),
  post:   (path, body)    => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)    => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path, opts)    => request(path, { method: 'DELETE', ...opts }),
};

export default api;
