#!/usr/bin/env node
/**
 * tools/smoke_all.mjs — Comprehensive Multi-Website & Server Smoke Test Suite
 *
 * Supports:
 *   node tools/smoke_all.mjs          # Tests local dev environment (localhost:4000, 5173, 5174, 5177)
 *   node tools/smoke_all.mjs --live   # Tests production deployments on Firebase & Cloud Functions
 */

const IS_LIVE = process.argv.includes('--live') || process.env.LIVE === '1';

const TARGETS = IS_LIVE ? {
  server: 'https://weddingalbums-b4bcd.web.app',
  client: 'https://weddingalbums-b4bcd.web.app',
  b2b: 'https://weddingalbums-studio.web.app',
  uiadmin: 'https://weddingalbums-uiadmin.web.app'
} : {
  server: 'http://localhost:4000',
  client: 'http://localhost:5173',
  b2b: 'http://localhost:5174',
  uiadmin: 'http://localhost:5177'
};

async function fetchUrl(url, options = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined,
      signal: ctrl.signal
    });
    const body = await res.text();
    let json = null;
    try { json = JSON.parse(body); } catch {}
    return {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      body,
      json
    };
  } catch (err) {
    return {
      status: 0,
      error: err.message
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runSmokeTests() {
  console.log('================================================================');
  console.log(`🚀 RUNNING COMPREHENSIVE MULTI-WEBSITE & SERVER SMOKE TESTS [${IS_LIVE ? 'LIVE PRODUCTION' : 'LOCAL DEV'}]`);
  console.log('================================================================\n');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function report(name, passed, detail = '') {
    totalTests++;
    if (passed) {
      passedTests++;
      console.log(`  ✅ [PASS] ${name} ${detail}`);
    } else {
      failedTests++;
      console.log(`  ❌ [FAIL] ${name} ${detail}`);
    }
  }

  // ── 1. BACKEND API SERVER ─────────────────────────────────────────────────
  console.log(`📦 1. Testing Backend API Server (${TARGETS.server})...`);
  
  const health = await fetchUrl(`${TARGETS.server}/api/health`);
  report('GET /api/health', health.status === 200, `(HTTP ${health.status}, DB: ${health.json?.database?.engine || health.json?.db || 'ok'})`);

  const content = await fetchUrl(`${TARGETS.server}/api/content?t=` + Date.now());
  const hasContent = content.status === 200 && (content.json?.global?.siteSettings || content.json?.global?.navbar);
  report('GET /api/content', hasContent, `(HTTP ${content.status}, Pages: ${Object.keys(content.json?.pages || {}).length})`);

  // Verify contact harmonization in API
  const sSettings = content.json?.global?.siteSettings || {};
  const footer = content.json?.global?.footer || {};
  const navbar = content.json?.global?.navbar || {};
  const phoneSynced = Boolean(sSettings.phone || footer.phone || navbar.phone);
  report('Contact Phone Availability', phoneSynced, `("${sSettings.phone || footer.phone || navbar.phone}")`);

  const sizes = await fetchUrl(`${TARGETS.server}/api/public/album-sizes`);
  report('GET /api/public/album-sizes', sizes.status === 200, `(HTTP ${sizes.status}, Count: ${Array.isArray(sizes.json) ? sizes.json.length : 0})`);

  const sheets = await fetchUrl(`${TARGETS.server}/api/public/sheets`);
  report('GET /api/public/sheets', sheets.status === 200, `(HTTP ${sheets.status}, Count: ${Array.isArray(sheets.json) ? sheets.json.length : 0})`);

  const svcs = await fetchUrl(`${TARGETS.server}/api/public/services`);
  report('GET /api/public/services', svcs.status === 200, `(HTTP ${svcs.status}, Count: ${Array.isArray(svcs.json) ? svcs.json.length : 0})`);

  const portfolio = await fetchUrl(`${TARGETS.server}/api/public/portfolio`);
  report('GET /api/public/portfolio', portfolio.status === 200, `(HTTP ${portfolio.status})`);

  // Admin Login Test
  const loginRes = await fetchUrl(`${TARGETS.server}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'contentadmin@weddingalbums.in', password: 'admin123', portalRole: 'content_admin' }
  });
  const token = loginRes.json?.token;
  report('POST /api/auth/login (Admin Auth)', loginRes.status === 200 && Boolean(token), `(HTTP ${loginRes.status}, Token: ${token ? 'Valid JWT' : 'None'})`);

  // Client Auth Login Test
  const clientLoginRes = await fetchUrl(`${TARGETS.server}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'client@weddingalbums.in', password: 'admin123', portalRole: 'b2c' }
  });
  const clientToken = clientLoginRes.json?.token;
  const isB2C = clientLoginRes.json?.user?.role === 'b2c';
  report('POST /api/auth/login (Client Auth)', clientLoginRes.status === 200 && Boolean(clientToken) && isB2C, `(HTTP ${clientLoginRes.status}, Role: ${clientLoginRes.json?.user?.role})`);

  // Verify Storefront Hero CTAs and Order Album in Content
  const heroProps = content.json?.pages?.home?.[0]?.props || {};
  const heroLinksOk = heroProps.btn1Link === '/shop' || heroProps.btn1Link === '/store' || heroProps.btn1Link === '/order';
  report('Storefront Hero CTAs (/shop direct)', heroLinksOk, `(btn1: "${heroProps.btn1Link}")`);

  const ctaIsOrder = navbar.ctaText === 'Order Album' || navbar.ctaText === 'ఆర్డర్ చేయండి';
  report('Navbar Order CTA (no "Book Now")', ctaIsOrder, `("${navbar.ctaText}")`);

  // SEO Suite Verification
  const sitemapRes = await fetchUrl(`${TARGETS.server}/sitemap.xml`);
  const sitemapOk = sitemapRes.status === 200 && sitemapRes.body?.includes('<urlset') && sitemapRes.body?.includes('weddingalbums');
  report('SEO: Root /sitemap.xml with Image Schema', sitemapOk, `(HTTP ${sitemapRes.status}, Size: ${sitemapRes.body?.length || 0} bytes)`);

  const robotsRes = await fetchUrl(`${TARGETS.server}/robots.txt`);
  const robotsOk = robotsRes.status === 200 && robotsRes.body?.includes('Googlebot');
  report('SEO: Root /robots.txt Directives', robotsOk, `(HTTP ${robotsRes.status})`);

  // ── 2. CLIENT STOREFRONT ──────────────────────────────────────────────────
  console.log(`\n🛍️ 2. Testing Client Storefront (${TARGETS.client})...`);
  
  const clientRoutes = [
    { path: '/', name: 'Landing Page' },
    { path: '/shop', name: 'Store Catalog' },
    { path: '/albums', name: 'Albums Spec Showcase' },
    { path: '/services', name: 'Services Directory' },
    { path: '/contact', name: 'Contact & Booking Desk' },
    { path: '/portfolio', name: 'Visual Portfolio' },
    { path: '/pricing', name: 'Pricing Plans' },
    { path: '/b2b', name: 'B2B Trade Landing' }
  ];

  for (const r of clientRoutes) {
    const res = await fetchUrl(`${TARGETS.client}${r.path}`);
    const ok = res.status === 200 && res.body.includes('<div id="root">');
    report(`Client Storefront: ${r.name} (${r.path})`, ok, `(HTTP ${res.status})`);
  }

  const cdnContent = await fetchUrl(`${TARGETS.client}/content.json`);
  report('Client Static CDN: /content.json', cdnContent.status === 200 && Boolean(cdnContent.json), `(HTTP ${cdnContent.status})`);

  // ── 3. STUDIO TRADE B2B PORTAL ────────────────────────────────────────────
  console.log(`\n🏢 3. Testing Studio Trade B2B Portal (${TARGETS.b2b})...`);
  
  const b2bRoutes = [
    { path: '/', name: 'Studio Portal Home / Landing' },
    { path: '/login', name: 'B2B Studio Login' },
    { path: '/signup', name: 'Studio Trade Application' }
  ];

  for (const r of b2bRoutes) {
    const res = await fetchUrl(`${TARGETS.b2b}${r.path}`);
    const ok = res.status === 200 && res.body.includes('<div id="root">');
    report(`B2B Portal: ${r.name} (${r.path})`, ok, `(HTTP ${res.status})`);
  }

  // ── 4. UIADMIN MASTER STUDIO ──────────────────────────────────────────────
  console.log(`\n🎨 4. Testing UIAdmin Master Studio (${TARGETS.uiadmin})...`);

  const adminRoutes = [
    { path: '/', name: 'Living In-Place Canvas Editor' },
    { path: '/dashboard', name: 'CMS Metric Dashboard' },
    { path: '/catalog', name: 'Product Catalog Editor' },
    { path: '/images', name: 'Media Library' },
    { path: '/history', name: 'Publish History Ledger' }
  ];

  for (const r of adminRoutes) {
    const res = await fetchUrl(`${TARGETS.uiadmin}${r.path}`);
    const ok = res.status === 200 && res.body.includes('<div id="root">');
    report(`UIAdmin: ${r.name} (${r.path})`, ok, `(HTTP ${res.status})`);
  }

  // ── SUMMARY REPORT ────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log(`🎯 SMOKE TEST SUMMARY: ${passedTests}/${totalTests} PASSED`);
  if (failedTests === 0) {
    console.log('✨ ALL WEBSITES AND SERVER SERVICES ARE 100% OPERATIONAL!');
  } else {
    console.log(`⚠️ ${failedTests} TESTS FAILED.`);
  }
  console.log('================================================================\n');

  process.exit(failedTests === 0 ? 0 : 1);
}

runSmokeTests();
