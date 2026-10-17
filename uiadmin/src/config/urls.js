/**
 * Environment-aware URLs for cross-portal preview links.
 * Dev: localhost ports for the sibling Vite apps.
 * Production (Firebase): the real web.app sites; (OCI/nginx build: the sibling subdomains resolve via SERVER-side config below if provided).
 */
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const withEnv = (envValue, devDefault, prodDefault) =>
  envValue || (isLocal ? devDefault : prodDefault);

export const CLIENT_URL = withEnv(import.meta.env.VITE_PREVIEW_URL, 'http://localhost:5173', 'https://weddingalbums-b4bcd.web.app');
export const OPS_URL = withEnv(import.meta.env.VITE_OPS_URL, 'http://localhost:5176', 'https://weddingalbums-sysadmin.web.app');
export const STUDIO_URL = withEnv(import.meta.env.VITE_STUDIO_URL, 'http://localhost:5174', 'https://weddingalbums-studio.web.app');
export const CREATOR_URL = withEnv(import.meta.env.VITE_CREATOR_URL, 'http://localhost:5175', 'https://weddingalbums-editor.web.app');
