/**
 * client/src/utils/apiClient.js
 * Resilient, Offline-First API Client with Exponential Backoff Retries & Timeout Protection
 */

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
      return '';
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:4000';
};

export const API_BASE = getBaseUrl();

/**
 * Fetch with automatic timeout protection
 */
export const fetchWithTimeout = async (resource, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000}s`);
    }
    throw error;
  }
};

/**
 * Resilient fetch with exponential backoff retries for network drops
 */
export const resilientFetch = async (
  endpoint,
  options = {},
  retries = 2,
  backoffMs = 800
) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);
      if (response.ok) {
        return response;
      }
      // If server returns 502/503/504, retry
      if (response.status >= 502 && response.status <= 504 && attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, backoffMs * Math.pow(2, attempt)));
        continue;
      }
      return response;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, backoffMs * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error(`Failed request to ${endpoint} after ${retries} retries`);
};

/**
 * Cached Content Getter with offline fallback
 */
export const getCachedContent = async (endpoint = '/api/content') => {
  const cacheKey = `api_cache_${endpoint}`;
  
  try {
    const res = await resilientFetch(endpoint, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        } catch { /* storage full */ }
        return { data, fromCache: false };
      }
    }
  } catch (err) {
    console.warn(`[apiClient] Network unavailable for ${endpoint}, checking offline cache...`, err.message);
  }

  // Fallback to cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.data) {
        return { data: parsed.data, fromCache: true, cachedAt: parsed.timestamp };
      }
    }
  } catch { /* parse error */ }

  return { data: null, fromCache: false };
};

export default {
  API_BASE,
  fetchWithTimeout,
  resilientFetch,
  getCachedContent
};
