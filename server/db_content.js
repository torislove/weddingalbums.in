/**
 * server/db_content.js
 * Pure PostgreSQL / resilient dual-engine content and media repository.
 * Re-exports Content and Media from db_postgres.js for 100% cloud & serverless compatibility.
 */
import { Content, Media } from './db_postgres.js';

export { Content, Media };
export default { Content, Media };
