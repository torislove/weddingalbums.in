import http from 'http';

const PORTS = {
  server: 4000,
  client: 5173,
  b2b: 5174,
  uiadmin: 5177
};

function fetchUrl(url, options = {}) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body,
          json
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 0,
        error: err.message
      });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runSmokeTests() {
  console.log('================================================================');
  console.log('🚀 RUNNING COMPREHENSIVE MULTI-WEBSITE & SERVER SMOKE TESTS');
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

  // ── 1. BACKEND API SERVER (PORT 4000) ──────────────────────────────────────
  console.log('📦 1. Testing Backend API Server (:4000)...');
  
  const health = await fetchUrl('http://localhost:4000/api/health');
  report('GET /api/health', health.status === 200, `(HTTP ${health.status}, DB: ${health.json?.db || 'unknown'})`);

  const content = await fetchUrl('http://localhost:4000/api/content?t=' + Date.now());
  const hasContent = content.status === 200 && content.json?.global?.siteSettings;
  report('GET /api/content', hasContent, `(HTTP ${content.status}, Pages: ${Object.keys(content.json?.pages || {}).length})`);

  // Verify contact harmonization in API
  const sSettings = content.json?.global?.siteSettings || {};
  const footer = content.json?.global?.footer || {};
  const navbar = content.json?.global?.navbar || {};
  const phoneSynced = sSettings.phone && sSettings.phone === footer.phone && sSettings.phone === navbar.phone;
  report('Contact Phone Harmonization', phoneSynced, `("${sSettings.phone}")`);
  const waSynced = sSettings.whatsapp && sSettings.whatsapp === footer.whatsapp && sSettings.whatsapp === navbar.whatsapp;
  report('WhatsApp Number Harmonization', waSynced, `("${sSettings.whatsapp}")`);

  const sizes = await fetchUrl('http://localhost:4000/api/builder/album-sizes');
  report('GET /api/builder/album-sizes', sizes.status === 200, `(HTTP ${sizes.status}, Count: ${Array.isArray(sizes.json) ? sizes.json.length : 0})`);

  const sheets = await fetchUrl('http://localhost:4000/api/builder/sheets');
  report('GET /api/builder/sheets', sheets.status === 200, `(HTTP ${sheets.status}, Count: ${Array.isArray(sheets.json) ? sheets.json.length : 0})`);

  const svcs = await fetchUrl('http://localhost:4000/api/builder/services');
  report('GET /api/builder/services', svcs.status === 200, `(HTTP ${svcs.status}, Count: ${Array.isArray(svcs.json) ? svcs.json.length : 0})`);

  const portfolio = await fetchUrl('http://localhost:4000/api/portfolio');
  report('GET /api/portfolio', portfolio.status === 200, `(HTTP ${portfolio.status})`);

  // Admin Login Test
  const loginRes = await fetchUrl('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'contentadmin@weddingalbums.in', password: 'admin123', portalRole: 'content_admin' }
  });
  const token = loginRes.json?.token;
  report('POST /api/auth/login (Admin Auth)', loginRes.status === 200 && Boolean(token), `(HTTP ${loginRes.status}, Token: ${token ? 'Valid JWT' : 'None'})`);

  // Client Auth Login Test
  const clientLoginRes = await fetchUrl('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'client@weddingalbums.in', password: 'admin123', portalRole: 'b2c' }
  });
  const clientToken = clientLoginRes.json?.token;
  const isB2C = clientLoginRes.json?.user?.role === 'b2c';
  report('POST /api/auth/login (Client Auth)', clientLoginRes.status === 200 && Boolean(clientToken) && isB2C, `(HTTP ${clientLoginRes.status}, Role: ${clientLoginRes.json?.user?.role})`);

  // Verify Storefront Hero CTAs and Order Album in Content
  const heroProps = content.json?.pages?.home?.[0]?.props || {};
  const heroLinksOk = heroProps.btn1Link === '/shop' && heroProps.btn2Link === '/shop';
  report('Storefront Hero CTAs (/shop direct)', heroLinksOk, `(btn1: "${heroProps.btn1Link}", btn2: "${heroProps.btn2Link}")`);

  const ctaIsOrder = content.json?.global?.navbar?.ctaText === 'Order Album';
  report('Navbar Order CTA (no "Book Now")', ctaIsOrder, `("${content.json?.global?.navbar?.ctaText}")`);

  // POST /api/content Test
  if (token && content.json) {
    const postRes = await fetchUrl('http://localhost:4000/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: content.json
    });
    report('POST /api/content (Save & Harmonize)', postRes.status === 200, `(HTTP ${postRes.status})`);
  }

  // SEO Suite Verification
  const sitemapRes = await fetchUrl('http://localhost:4000/sitemap.xml');
  const sitemapOk = sitemapRes.status === 200 && sitemapRes.body?.includes('<urlset') && sitemapRes.body?.includes('cover-acrylic-3d.jpg');
  report('SEO: Root /sitemap.xml with Image Schema', sitemapOk, `(HTTP ${sitemapRes.status}, Size: ${sitemapRes.body?.length || 0} bytes)`);

  const robotsRes = await fetchUrl('http://localhost:4000/robots.txt');
  const robotsOk = robotsRes.status === 200 && robotsRes.body?.includes('Googlebot');
  report('SEO: Root /robots.txt Directives', robotsOk, `(HTTP ${robotsRes.status})`);

  const indexNowRes = await fetchUrl('http://localhost:4000/api/seo/ping-indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {}
  });
  const indexNowOk = indexNowRes.status === 200 && indexNowRes.json?.success === true;
  report('SEO: Instant IndexNow Search Engine Ping', indexNowOk, `(HTTP ${indexNowRes.status}, Protocol: ${indexNowRes.json?.protocol})`);

  // ── 2. CLIENT STOREFRONT (PORT 5173) ───────────────────────────────────────
  console.log('\n🛍️ 2. Testing Client Storefront (:5173)...');
  
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
    const res = await fetchUrl(`http://localhost:5173${r.path}`);
    const ok = res.status === 200 && res.body.includes('<div id="root">');
    report(`Client Storefront: ${r.name} (${r.path})`, ok, `(HTTP ${res.status})`);
  }

  const cdnContent = await fetchUrl('http://localhost:5173/content.json');
  report('Client Static CDN: /content.json', cdnContent.status === 200 && cdnContent.json?.pages, `(HTTP ${cdnContent.status})`);

  // ── 3. STUDIO TRADE B2B PORTAL (PORT 5174) ─────────────────────────────────
  console.log('\n🏢 3. Testing Studio Trade B2B Portal (:5174)...');
  
  const b2bRoutes = [
    { path: '/', name: 'Studio Portal Home / Dashboard' },
    { path: '/login', name: 'B2B Studio Login' },
    { path: '/register', name: 'Studio Trade Application' }
  ];

  for (const r of b2bRoutes) {
    const res = await fetchUrl(`http://localhost:5174${r.path}`);
    const ok = res.status === 200 && res.body.includes('<div id="root">');
    report(`B2B Portal: ${r.name} (${r.path})`, ok, `(HTTP ${res.status})`);
  }

  // ── 4. UIADMIN MASTER STUDIO (PORT 5177) ───────────────────────────────────
  console.log('\n🎨 4. Testing UIAdmin Master Studio (:5177)...');

  const adminRoutes = [
    { path: '/', name: 'Living In-Place Canvas Editor' },
    { path: '/dashboard', name: 'CMS Metric Dashboard' },
    { path: '/catalog', name: 'Product Catalog Editor' },
    { path: '/images', name: 'Media Library' },
    { path: '/history', name: 'Publish History Ledger' }
  ];

  for (const r of adminRoutes) {
    const res = await fetchUrl(`http://localhost:5177${r.path}`);
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
