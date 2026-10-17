/**
 * server/config.js — single source of truth for security-sensitive runtime config.
 *
 * Why this file exists
 * --------------------
 * Before this, `process.env.JWT_SECRET || 'super_secret_wedding_key_2026'` was copy-pasted
 * into five modules. That made it easy to ship the public dev fallback secret to production
 * (a full auth bypass: anyone can mint a valid token). All of those call sites now import
 * from here instead.
 *
 * Behaviour
 * ---------
 *   • development (default)      → falls back to the published dev secret, with a warning.
 *   • production / Cloud Runs    → the fallback is NEVER used silently: `JWT_INSECURE` is set
 *                                  and `index.js` refuses to serve traffic until it is fixed.
 *
 * Set the real secret in `server/.env` (local) or `server/.env.<projectId>` (Firebase deploys);
 * see `server/.env.example`.
 */
import dotenv from 'dotenv';

dotenv.config();

/** The public, well-known development secret. Never valid in production. */
export const DEV_JWT_SECRET = 'super_secret_wedding_key_2026';

/** Issuer embedded in every token; verified on decode. */
export const JWT_ISSUER = 'weddingalbums.in';

/** Are we running inside Cloud Functions / Cloud Run (or an emulator)? */
const isCloudRun = Boolean(
  process.env.K_SERVICE ||
  process.env.FUNCTION_TARGET ||
  process.env.FUNCTIONS_EMULATOR ||
  process.env.FIREBASE_CONFIG
);

const nodeEnv = (process.env.NODE_ENV || '').trim().toLowerCase();

/** True for any non-development deployment. */
export const isProduction = nodeEnv === 'production' || (nodeEnv !== 'development' && isCloudRun);

const configuredSecret = (process.env.JWT_SECRET || '').trim();

/**
 * True when we are about to run with the public fallback secret in a non-dev environment.
 * `index.js` turns this into a hard, loud failure instead of a silent security hole.
 */
export const JWT_INSECURE = !configuredSecret || configuredSecret === DEV_JWT_SECRET;

export const JWT_SECRET = configuredSecret || DEV_JWT_SECRET;

if (JWT_INSECURE && isProduction) {
  console.error(
    '\n🚨 SECURITY: JWT_SECRET is not set (or is still the public development default).\n' +
    '   Refusing to serve traffic with a guessable signing key.\n' +
    '   Fix: create `server/.env.<projectId>` (or set the Cloud Functions env var) with\n' +
    '   `JWT_SECRET=<64+ random chars>`. See server/.env.example.\n'
  );
} else if (JWT_INSECURE) {
  console.warn('[config] ⚠️  Using the insecure development JWT secret (fine locally, never in production).');
}
