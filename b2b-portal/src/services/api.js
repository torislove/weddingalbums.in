/**
 * api.js — Centralised API service layer for B2B / Editor portals.
 * Automatically attaches the Bearer token and handles 401 → refresh flow.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getToken = () => localStorage.getItem('token');

const refreshAccessToken = async () => {
  const res = await fetch(`${BASE}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Session expired');
  const { token } = await res.json();
  localStorage.setItem('token', token);
  return token;
};

/**
 * Main request helper. Retries once with a refreshed token on 401.
 */
const request = async (path, options = {}, retry = true) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers, credentials: 'include' });

  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken();
      return request(path, options, false); // one retry
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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

// ── Convenience methods ──────────────────────────────────────────────────────

export const api = {
  get:    (path, opts)    => request(path, { method: 'GET', ...opts }),
  post:   (path, body)    => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)    => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)          => request(path, { method: 'DELETE' }),

  // ── Auth ──────────────────────────────────────────────────────────────────
  login:   (email, password, portalRole) => api.post('/api/auth/login',  { email, password, portalRole }),
  logout:  ()                            => api.post('/api/auth/logout', {}),
  refresh: ()                            => refreshAccessToken(),

  // ── B2B / Editor specific endpoints ──────────────────────────────────────
  jobs: {
    submit:  (data) => api.post('/api/b2b/jobs', data),
    list:    ()     => api.get('/api/b2b/jobs'),
    available: ()   => api.get('/api/editor/available-jobs'),
    claim:   (id)   => api.post(`/api/editor/claim-job/${id}`, {}),
    approve: (id)   => api.post(`/api/admin/jobs/${id}/approve`, {}),
  },

  wallet: {
    get:    () => api.get('/api/wallet'),
    payout: (amount) => api.post('/api/payout', { amount }),
  },

  packages: {
    list: () => api.get('/api/packages'),
  },
};

export default api;
