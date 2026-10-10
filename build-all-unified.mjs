import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const outputDir = path.join(rootDir, 'dist');

console.log('🚀 Starting Unified Build for all 5 Frontend Applications & Server...');

// Helper to copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Build Client Portal
console.log('\n📦 [1/5] Building Client Portal (B2C)...');
execSync('npm run build', { cwd: path.join(rootDir, 'client'), stdio: 'inherit' });

// 2. Build B2B Studio Portal
console.log('\n📦 [2/5] Building B2B Studio Portal...');
execSync('npm run build', { cwd: path.join(rootDir, 'b2b-portal'), stdio: 'inherit' });

// 3. Build Editor Portal
console.log('\n📦 [3/5] Building Editor / Creator Portal...');
execSync('npm run build', { cwd: path.join(rootDir, 'editor-portal'), stdio: 'inherit' });

// 4. Build SysAdmin Portal
console.log('\n📦 [4/5] Building SysAdmin / Ops Portal...');
execSync('npm run build', { cwd: path.join(rootDir, 'sysadmin'), stdio: 'inherit' });

// 5. Build UIAdmin CMS Portal
console.log('\n📦 [5/5] Building UIAdmin CMS Portal...');
execSync('npm run build', { cwd: path.join(rootDir, 'uiadmin'), stdio: 'inherit' });

// Assemble unified dist directory
console.log('\n📁 Assembling Unified Distribution Folder...');
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// Copy Client build as main root
copyDir(path.join(rootDir, 'client', 'dist'), outputDir);

// Copy Portals into subdirectories
copyDir(path.join(rootDir, 'b2b-portal', 'dist'), path.join(outputDir, 'studio'));
copyDir(path.join(rootDir, 'editor-portal', 'dist'), path.join(outputDir, 'creator'));
copyDir(path.join(rootDir, 'sysadmin', 'dist'), path.join(outputDir, 'ops'));
copyDir(path.join(rootDir, 'uiadmin', 'dist'), path.join(outputDir, 'cms'));

console.log('✅ Unified Build Completed Successfully!');
console.log('   - Client Portal:       dist/ (/)');
console.log('   - Studio Portal:       dist/studio (/studio)');
console.log('   - Creator Portal:      dist/creator (/creator)');
console.log('   - Ops Admin:           dist/ops (/ops)');
console.log('   - CMS Admin:           dist/cms (/cms)');
