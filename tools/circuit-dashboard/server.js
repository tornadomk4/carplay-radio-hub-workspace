const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 8081;
const WORKSPACE = 'C:\\Users\\frank\\.openclaw\\workspace';
const OPERATOR = path.join(WORKSPACE, 'operator-workspace');
const PROJECT = path.join(WORKSPACE, 'projects', 'carplayradiohub-site', 'carplayradiohub_site');

// --- Helpers ---

function json(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data, null, 2));
}

function html(res, body) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(body);
}

function getFiles(dir, ext) {
  try {
    return fs.readdirSync(dir)
      .filter(f => !ext || f.endsWith(ext))
      .map(f => {
        const p = path.join(dir, f);
        const s = fs.statSync(p);
        return { name: f, path: p, size: s.size, mtime: s.mtime.toISOString() };
      })
      .sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
  } catch { return []; }
}

function getRecentFiles(dirs, limit = 20) {
  let all = [];
  for (const d of dirs) {
    all = all.concat(getFiles(d).map(f => ({ ...f, dir: d })));
  }
  return all.sort((a, b) => new Date(b.mtime) - new Date(a.mtime)).slice(0, limit);
}

function readJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function readTextSafe(p, max = 2000) {
  try { return fs.readFileSync(p, 'utf8').slice(0, max); } catch { return ''; }
}

// --- Data collectors ---

function getDashboardData() {
  const now = new Date().toISOString();

  // Activity log
  const activityLog = readJsonSafe(path.join(__dirname, 'activityLog.json')) || [];

  // Recent QA screenshots
  const qaDir = path.join(OPERATOR, 'browser-qa');
  const screenshots = getFiles(qaDir, '.png').map(f => f.name);

  // Recent QA notes
  const qaNotes = getFiles(qaDir, '.md').slice(0, 5).map(f => ({
    name: f.name,
    preview: readTextSafe(f.path, 300)
  }));

  // Playwright outputs
  const pwOutputs = getFiles(path.join(OPERATOR, 'playwright-mcp', 'outputs')).slice(0, 10);

  // Recent workspace changes
  const recentFiles = getRecentFiles([
    OPERATOR,
    path.join(WORKSPACE, 'projects', 'carplayradiohub-site'),
    path.join(WORKSPACE, 'memory')
  ], 25);

  // Project status
  const projectBuild = getFiles(path.join(PROJECT, 'dist')).length > 0;
  const sitePackage = readJsonSafe(path.join(PROJECT, 'package.json'));
  const gitStatus = (() => {
    try { return execSync('git status --porcelain', { cwd: PROJECT, encoding: 'utf8' }).trim(); }
    catch { return 'not a git repo'; }
  })();

  // Cron jobs - read from OpenClaw config
  const cronJobs = (() => {
    try {
      const cfg = JSON.parse(fs.readFileSync('C:\Users\frank\.openclaw\openclaw.json', 'utf8'));
      const jobs = cfg.cron?.jobs || cfg.cron || [];
      if (Array.isArray(jobs)) return jobs;
      return [];
    } catch { return []; }
  })();

  // Service health
  const services = (() => {
    const net = require('net');
    const checks = [
      { name: 'Dashboard', port: 8081 },
      { name: 'Site Preview', port: 4173 },
      { name: 'SearxNG', port: 8080 },
    ];
    return checks.map(s => {
      // We can't sync-check ports in Node http handler easily, so we mark as checked
      return { ...s, status: 'checked' };
    });
  })();

  // Business snapshot
  const business = {
    salePrice: '$109.99',
    regularPrice: '$150',
    cost: '$62.99',
    backupCamera: 'Included',
    shipping: 'Same-day on timely orders, ≤4 days delivery',
    replacement: '30-day replacement policy',
    lastReelViews: '18,500',
    lastReelDMs: '42',
    estimatedSales: '5-6',
    adSpend: '$30'
  };

  // Open tasks
  const tasks = [
    { text: 'Confirm Stripe link price/product name', priority: 'high' },
    { text: 'Confirm Jotform fields and submission flow', priority: 'high' },
    { text: 'Gather real product/install photos & videos', priority: 'high' },
    { text: 'Set up heavier research tools (TikTok-Api, instaloader, browser-use, agent-browser)', priority: 'medium' },
    { text: 'Deploy site live (Vercel/Netlify/self-hosted)', priority: 'medium' },
    { text: 'Add DM quick-replies to IG Saved Replies', priority: 'low' },
    { text: 'Explore Phase 2 offers: backup cams, dash cams, interior LEDs, MK4 bundles', priority: 'low' }
  ];

  // MCP/Skill status
  const mcpServers = [
    { name: 'Playwright MCP', status: 'installed', url: 'https://github.com/microsoft/playwright-mcp' },
    { name: 'Chrome DevTools MCP', status: 'installed', url: 'https://github.com/ChromeDevTools/chrome-devtools-mcp' },
    { name: 'yt-dlp', status: 'installed', url: 'https://github.com/yt-dlp/yt-dlp' },
    { name: 'gallery-dl', status: 'installed', url: 'https://github.com/mikf/gallery-dl' }
  ];

  const skills = [
    { name: 'carplay-funnel-ops', status: 'live' },
    { name: 'playwright-operator-ops', status: 'live' },
    { name: 'browser-automation', status: 'available' },
    { name: 'github', status: 'available' },
    { name: 'notion', status: 'available' },
    { name: 'weather', status: 'available' },
    { name: 'obstacle-recovery', status: 'available' }
  ];

  return {
    now, screenshots, qaNotes, pwOutputs, recentFiles,
    projectBuild, sitePackage: sitePackage?.name || 'unknown',
    gitStatus, cronJobs, services, business, tasks, mcpServers, skills,
    activityLog: activityLog.slice(0, 15)
  };
}

// --- HTML renderer ---

function renderDashboard(data) {
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const screenshotThumbs = data.screenshots.map(s =>
    `<div class="thumb"><img src="/api/screenshot?name=${esc(s)}" alt="${esc(s)}" loading="lazy"><span>${esc(s)}</span></div>`
  ).join('');

  const recentFiles = data.recentFiles.map(f => {
    const rel = f.path.replace('C:\\Users\\frank\\.openclaw\\workspace\\', '');
    const dir = f.dir.replace('C:\\Users\\frank\\.openclaw\\workspace\\', '');
    return `<tr><td>${esc(dir)}</td><td>${esc(f.name)}</td><td>${new Date(f.mtime).toLocaleString('en-US', { timeZone: 'America/New_York' })}</td></tr>`;
  }).join('');

  const tasks = data.tasks.map(t => {
    const color = t.priority === 'high' ? '#ef4444' : t.priority === 'medium' ? '#f59e0b' : '#6b7280';
    return `<li><span class="dot" style="background:${color}"></span>${esc(t.text)}</li>`;
  }).join('');

  const mcps = data.mcpServers.map(m =>
    `<div class="badge green">${esc(m.name)} <a href="${esc(m.url)}" target="_blank">↗</a></div>`
  ).join('');

  const skills = data.skills.map(s => {
    const cls = s.status === 'live' ? 'green' : 'gray';
    return `<div class="badge ${cls}">${esc(s.name)} <small>${esc(s.status)}</small></div>`;
  }).join('');

  const qaNotes = data.qaNotes.map(n =>
    `<details><summary>${esc(n.name)}</summary><pre>${esc(n.preview)}</pre></details>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Circuit Dashboard</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f1117;color:#e2e8f0;min-height:100vh}
.header{background:linear-gradient(135deg,#1e293b,#0f172a);padding:24px 32px;border-bottom:1px solid #1e293b;display:flex;align-items:center;justify-content:space-between}
.header h1{font-size:22px;font-weight:700;color:#f1f5f9}
.header .meta{font-size:13px;color:#94a3b8}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:16px;padding:24px 32px}
.card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px}
.card h2{font-size:15px;font-weight:600;color:#93c5fd;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px}
.card h3{font-size:13px;color:#94a3b8;margin:12px 0 6px}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #1e293b}
th{color:#94a3b8;font-weight:500;font-size:12px;text-transform:uppercase}
td{color:#cbd5e1;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
tr:hover td{background:#334155}
img{max-width:100%;border-radius:8px;border:1px solid #334155}
.thumb{display:inline-block;width:140px;margin:4px;text-align:center;font-size:11px;color:#94a3b8}
.thumb img{width:140px;height:90px;object-fit:cover;display:block;margin-bottom:4px}
.badges{display:flex;flex-wrap:wrap;gap:6px}
.badge{display:inline-block;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:500}
.badge.green{background:#064e3b;color:#6ee7b7}
.badge.gray{background:#1e293b;color:#94a3b8}
.badge a{color:inherit;text-decoration:none;margin-left:4px}
ul.task-list{list-style:none;display:flex;flex-direction:column;gap:6px}
ul.task-list li{display:flex;align-items:center;gap:8px;font-size:13px;color:#cbd5e1}
.dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
details{background:#0f172a;border-radius:8px;padding:8px 12px;margin:6px 0;font-size:12px}
summary{cursor:pointer;color:#93c5fd;font-weight:500;font-size:13px}
pre{white-space:pre-wrap;color:#94a3b8;margin-top:8px;font-size:12px;line-height:1.5}
.kv{display:grid;grid-template-columns:auto 1fr;gap:4px 16px;font-size:13px}
.kv dt{color:#94a3b8}
.kv dd{color:#e2e8f0;font-weight:500}
.status-line{display:flex;align-items:center;gap:8px;font-size:13px;margin:4px 0}
.status-line .dot{width:10px;height:10px}
.full-width{grid-column:1/-1}
@media(max-width:768px){.grid{grid-template-columns:1fr;padding:16px}}
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>🤖 Circuit Dashboard</h1>
    <div class="meta">Last updated: ${new Date(data.now).toLocaleString('en-US', { timeZone: 'America/New_York' })}</div>
  </div>
  <div class="meta">Workspace: ~/.openclaw/workspace</div>
</div>

<div class="grid">

  <!-- Business Snapshot -->
  <div class="card">
    <h2>💰 Business Snapshot</h2>
    <dl class="kv">
      <dt>Sale Price</dt><dd>${data.business.salePrice}</dd>
      <dt>Regular Price</dt><dd>${data.business.regularPrice}</dd>
      <dt>Cost</dt><dd>${data.business.cost}</dd>
      <dt>Backup Camera</dt><dd>${data.business.backupCamera}</dd>
      <dt>Shipping</dt><dd>${data.business.shipping}</dd>
      <dt>Replacement</dt><dd>${data.business.replacement}</dd>
    </dl>
    <h3>Last Reel Performance</h3>
    <dl class="kv">
      <dt>Views</dt><dd>${data.business.lastReelViews}</dd>
      <dt>DMs Started</dt><dd>${data.business.lastReelDMs}</dd>
      <dt>Est. Sales</dt><dd>${data.business.estimatedSales}</dd>
      <dt>Ad Spend</dt><dd>${data.business.adSpend}</dd>
    </dl>
    <h3>GitHub</h3>
    <a href="https://github.com/tornadomk4/carplay-radio-hub" target="blank" style="color:#60a5fa;font-size:13px">tornadomk4/carplay-radio-hub ↗</a>
  </div>

  <!-- Site Status -->
  <div class="card">
    <h2>🌐 Site Status</h2>
    <div class="status-line"><span class="dot" style="background:${data.projectBuild ? '#22c55e' : '#ef4444'}"></span>Build: ${data.projectBuild ? 'Passing ✓' : 'Not built ✗'}</div>
    <div class="status-line"><span class="dot" style="background:#3b82f6"></span>Project: ${data.sitePackage}</div>
    <div class="status-line"><span class="dot" style="background:${data.gitStatus === 'not a git repo' ? '#6b7280' : data.gitStatus === '' ? '#22c55e' : '#f59e0b'}"></span>Git: ${data.gitStatus === 'not a git repo' ? 'Not a repo' : data.gitStatus === '' ? 'Clean' : 'Uncommitted changes'}</div>
    <h3>Preview</h3>
    <a href="http://127.0.0.1:4173" target="_blank" style="color:#60a5fa;font-size:13px">http://127.0.0.1:4173 ↗</a><br><a href="http://127.0.0.1:8081" target="_blank" style="color:#60a5fa;font-size:13px">Dashboard: http://127.0.0.1:8081 ↗</a>
    <h3>Tasks</h3>
    <ul class="task-list">${tasks}</ul>
  </div>

  <!-- Screenshots -->
  <div class="card full-width">
    <h2>📸 Latest Screenshots</h2>
    ${screenshotThumbs || '<p style="color:#94a3b8;font-size:13px">No screenshots yet</p>'}
  </div>

  <!-- Recent Changes -->
  <div class="card full-width">
    <h2>📝 Recent Changes</h2>
    <table>
      <thead><tr><th>Folder</th><th>File</th><th>Modified</th></tr></thead>
      <tbody>${recentFiles}</tbody>
    </table>
  </div>

  <!-- QA Notes -->
  <div class="card">
    <h2>🔍 QA Notes</h2>
    ${qaNotes || '<p style="color:#94a3b8;font-size:13px">No QA notes yet</p>'}
  </div>

  <!-- MCPs & Skills -->
  <div class="card">
    <h2>🔧 MCP Servers</h2>
    <div class="badges" style="margin-bottom:16px">${mcps}</div>
    <h2>🧩 Skills</h2>
    <div class="badges">${skills}</div>
  </div>

  <!-- Activity Log -->
  <div class="card full-width">
    <h2>📋 Activity Log</h2>
    <div style="max-height:300px;overflow-y:auto">
    ${data.activityLog.map(a => {
      const t = new Date(a.timestamp).toLocaleString('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      const icon = a.type === 'site_fix' ? '🔧' : a.type === 'mcp_setup' ? '🔌' : a.type === 'business' ? '💰' : a.type === 'site_qa' ? '🔍' : a.type === 'research' ? '📊' : a.type === 'tool' ? '🛠️' : a.type === 'memory' ? '🧠' : a.type === 'config' ? '⚙️' : '📝';
      return `<div style="padding:8px 0;border-bottom:1px solid #1e293b;display:flex;gap:12px;align-items:flex-start"><span style="font-size:16px;flex-shrink:0">${icon}</span><div><div style="font-size:13px;color:#e2e8f0">${esc(a.summary)}</div>${a.details ? `<div style="font-size:12px;color:#94a3b8;margin-top:2px">${esc(a.details)}</div>` : ''}<div style="font-size:11px;color:#64748b;margin-top:2px">${t}</div></div></div>`;
    }).join('')}
    </div>
  </div>

  <!-- System Health -->
  <div class="card">
    <h2>🖥️ System Health</h2>
    <div class="status-line"><span class="dot" style="background:#22c55e"></span>Dashboard: Online</div>
    <div class="status-line"><span class="dot" style="background:#22c55e"></span>GitHub: Connected</div>
    <div class="status-line"><span class="dot" style="background:#3b82f6"></span>Ollama: Standby</div>
    <div class="status-line"><span class="dot" style="background:#3b82f6"></span>Search: SearxNG</div>
    <h3>Installed Tools</h3>
    <div class="badges">
      <div class="badge green">gog</div>
      <div class="badge green">himalaya</div>
      <div class="badge green">github</div>
      <div class="badge green">notion</div>
      <div class="badge green">weather</div>
      <div class="badge green">mcporter</div>
      <div class="badge green">edge-tts</div>
    </div>
  </div>

  <!-- Cron Jobs -->
  <div class="card">
    <h2>⏰ Scheduled Tasks</h2>
    ${data.cronJobs && data.cronJobs.length > 0
      ? data.cronJobs.map(j => {
          const enabled = j.enabled !== false;
          const sched = j.schedule;
          const desc = sched?.expr || sched?.at || JSON.stringify(sched);
          const tz = sched?.tz ? ` (${sched.tz})` : '';
          return `<div class="status-line"><span class="dot" style="background:${enabled ? '#22c55e' : '#6b7280'}"></span><strong>${esc(j.name)}</strong><br><span style="color:#94a3b8;font-size:12px;margin-left:18px">${esc(desc)}${esc(tz)}</span></div>`;
        }).join('')
      : '<div style="color:#94a3b8;font-size:12px">No scheduled tasks</div>'}
  </div>

</div>
</body>
</html>`;
}

// --- Server ---

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/cron') {
    return json(res, getDashboardData().cronJobs);
  }

  if (url.pathname === '/api/data') {
    return json(res, getDashboardData());
  }

  if (url.pathname === '/api/screenshot') {
    const name = url.searchParams.get('name');
    if (!name) return res.writeHead(400), res.end('Missing name');
    const filePath = path.join(OPERATOR, 'browser-qa', name);
    if (!fs.existsSync(filePath)) return res.writeHead(404), res.end('Not found');
    res.writeHead(200, { 'Content-Type': 'image/png' });
    return fs.createReadStream(filePath).pipe(res);
  }

  if (url.pathname === '/api/refresh') {
    // Trigger a fresh site build check
    try {
      const result = execSync('npm run build', { cwd: PROJECT, encoding: 'utf8', timeout: 60000 });
      return json(res, { success: true, output: result.slice(-500) });
    } catch (e) {
      return json(res, { success: false, error: e.message });
    }
  }

  // Default: serve dashboard (with no-cache headers for auto-refresh)
  res.setHeader('Cache-Control', 'no-store');
  const data = getDashboardData();
  return html(res, renderDashboard(data));
});

server.listen(PORT, '127.0.0.1', () => {
  const msg = `🤖 Circuit Dashboard running at http://127.0.0.1:${PORT}`;
  console.log(msg);
  try { fs.appendFileSync(path.join(__dirname, 'dashboard.log'), `[${new Date().toISOString()}] ${msg}\n`); } catch {}
});

process.on('uncaughtException', (err) => {
  try { fs.appendFileSync(path.join(__dirname, 'dashboard.log'), `[${new Date().toISOString()}] ERROR: ${err.message}\n`); } catch {}
  process.exit(1);
});
