# Chicago’s Money — Salaries Integration Pack

Everything you need to ship a token-safe salary search + linkable presets, plus nightly snapshots for fast static pages.

---

## 1) `/public_html/api/salaries.php` — Socrata proxy (hide your token)

```php
<?php
// /public_html/api/salaries.php
// Simple Socrata proxy for the Current Employee Names, Salaries dataset (xzkq-xp2w)
// Hides your X-App-Token on the server. Accepts:
//   ?url=<full Socrata URL to xzkq-xp2w.json>       -> returns JSON
//   ?csv=1&url=<full Socrata URL to xzkq-xp2w.csv>  -> returns CSV
//
// SECURITY: Strictly allow only data.cityofchicago.org/resource/xzkq-xp2w.(json|csv)
// to prevent SSRF.

$APP_TOKEN = 'REPLACE_WITH_YOUR_SOCRATA_APP_TOKEN'; // <— paste your token here

if (!isset($_GET['url'])) {
  http_response_code(400);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['error' => 'Missing url parameter']);
  exit;
}

$target = $_GET['url'];
$parts = parse_url($target);
if (!$parts) {
  http_response_code(400);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['error' => 'Invalid URL']);
  exit;
}

$hostOK = isset($parts['host']) && $parts['host'] === 'data.cityofchicago.org';
$pathOK = isset($parts['path']) && preg_match('#^/resource/xzkq-xp2w\.(json|csv)$#', $parts['path']);
if (!$hostOK || !$pathOK) {
  http_response_code(400);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['error' => 'URL not allowed']);
  exit;
}

$scheme = $parts['scheme'] ?? 'https';
$query = $parts['query'] ?? '';
$finalUrl = $scheme . '://' . $parts['host'] . $parts['path'] . ($query ? '?' . $query : '');

$ch = curl_init($finalUrl);
$headers = [];
if (!empty($APP_TOKEN)) $headers[] = 'X-App-Token: ' . $APP_TOKEN;

curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_CONNECTTIMEOUT => 8,
  CURLOPT_TIMEOUT => 20,
  CURLOPT_HTTPHEADER => $headers
]);

$resp = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$isCsv = (strpos($parts['path'], '.csv') !== false);
$contentType = $isCsv ? 'text/csv; charset=utf-8' : 'application/json; charset=utf-8';
curl_close($ch);

if ($http >= 200 && $http < 300) {
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: ' . $contentType);
  echo $resp;
} else {
  http_response_code($http ?: 502);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['error' => 'Upstream error', 'status' => $http]);
}
```

**Deploy:** Create folder `/public_html/api/`, add `salaries.php`, paste token.

---

## 2) `/public_html/salaries.html` — Merged widget (proxy + presets + linkable URLs)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Chicago Employee Salaries — Search</title>
  <style>
    :root { --bg:#0b0c10; --card:#111218; --muted:#1a1b22; --text:#e8e9ee; --sub:#a9adbf; --accent:#ffd166; --line:#242632; }
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji"}
    .wrap{max-width:1100px;margin:48px auto;padding:0 16px}
    .card{background:var(--card);border:1px solid var(--line);border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
    h1{font-size:28px;margin:0 0 16px}
    p.lead{color:var(--sub);margin:0 0 24px}
    form{display:grid;grid-template-columns:repeat(12,1fr);gap:12px;padding:18px;border-bottom:1px solid var(--line)}
    label{font-size:12px;color:var(--sub);display:block;margin-bottom:6px}
    input,select,button{width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--muted);color:var(--text)}
    input::placeholder{color:#7b8092}
    .col-3{grid-column:span 3}.col-4{grid-column:span 4}.col-6{grid-column:span 6}.col-8{grid-column:span 8}.col-9{grid-column:span 9}.col-12{grid-column:span 12}
    .controls{display:flex;gap:12px;align-items:end}
    .btn{cursor:pointer;background:#222432;border:1px solid #2b2d3a}
    .btn.primary{background:linear-gradient(180deg,#2c2f3b,#20222d);border-color:#2b2e3a}
    .btn.accent{background:var(--accent);color:#1a1a1a;border-color:#e0b34a}
    .btn:disabled{opacity:.6;cursor:not-allowed}
    .results{padding:8px 18px 18px}
    .meta{display:flex;gap:12px;align-items:center;justify-content:space-between;margin:12px 0}
    .meta small{color:var(--sub)}
    table{width:100%;border-collapse:separate;border-spacing:0;overflow:clip;border-radius:12px;border:1px solid var(--line)}
    thead th{font-size:12px;color:var(--sub);text-align:left;background:#0f1016;padding:10px 12px;border-bottom:1px solid var(--line)}
    tbody td{padding:12px;border-bottom:1px solid var(--line)}
    tbody tr:hover{background:#141621}
    .badge{display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;border:1px solid var(--line);background:#171926;color:var(--sub)}
    .num{text-align:right;font-variant-numeric:tabular-nums}
    .pill{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;border:1px solid var(--line);background:#141621}
    .hl{background:linear-gradient(90deg,rgba(255,209,102,.2),rgba(255,209,102,.05));border:1px solid rgba(255,209,102,.35)}
    .notice{margin-top:10px;color:var(--sub)}
    .skeleton{height:12px;background:#1b1d27;border-radius:6px;animation:pulse 1.2s infinite ease-in-out}
    @keyframes pulse{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
    @media (max-width:900px){.col-3,.col-4,.col-6,.col-8,.col-9{grid-column:span 12}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div style="padding:18px 18px 0">
        <h1>Search City of Chicago Employee Salaries</h1>
        <p class="lead">Live query of the City of Chicago <em>Current Employee Names, Salaries, and Position Titles</em> dataset via a server-side proxy. Filter by name, department, job title, status, and pay. Export results to CSV.</p>
      </div>

      <form id="searchForm">
        <div class="col-4">
          <label for="name">Name (contains)</label>
          <input id="name" name="name" type="text" placeholder="e.g., SMITH" />
        </div>
        <div class="col-4">
          <label for="dept">Department</label>
          <select id="dept" name="dept">
            <option value="">All departments…</option>
          </select>
        </div>
        <div class="col-4">
          <label for="title">Job Title (contains)</label>
          <input id="title" name="title" type="text" placeholder="e.g., ENGINEER" />
        </div>
        <div class="col-3">
          <label for="minSal">Min Annual Salary ($)</label>
          <input id="minSal" name="minSal" type="number" inputmode="numeric" min="0" step="1000" placeholder="50000" />
        </div>
        <div class="col-3">
          <label for="maxSal">Max Annual Salary ($)</label>
          <input id="maxSal" name="maxSal" type="number" inputmode="numeric" min="0" step="1000" placeholder="200000" />
        </div>
        <div class="col-3">
          <label for="ft">Status</label>
          <select id="ft" name="ft">
            <option value="">All</option>
            <option value="F">Full-time</option>
            <option value="P">Part-time</option>
          </select>
        </div>
        <div class="col-3">
          <label for="payType">Pay Type</label>
          <select id="payType" name="payType">
            <option value="">Salary + Hourly</option>
            <option value="Salary">Salary only</option>
            <option value="Hourly">Hourly only</option>
          </select>
        </div>
        <div class="col-12">
          <label>Saved searches</label>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            <button type="button" class="btn pill" data-preset="top100">🏆 Top 100 earners</button>
            <button type="button" class="btn pill" data-preset="police200">🚓 Police — $200k+</button>
            <button type="button" class="btn pill" data-preset="fire200">🚒 Fire — $200k+</button>
            <button type="button" class="btn pill" data-preset="overtitle-chief">👔 Titles containing “CHIEF”</button>
          </div>
        </div>
        <div class="col-9 controls">
          <div style="flex:1">
            <label for="sortBy">Sort</label>
            <select id="sortBy">
              <option value="employee_annual_salary DESC">Annual Salary ↓</option>
              <option value="employee_annual_salary ASC">Annual Salary ↑</option>
              <option value="name ASC">Name A→Z</option>
              <option value="department ASC">Department A→Z</option>
            </select>
          </div>
          <div>
            <label for="limit">Per page</label>
            <select id="limit">
              <option>25</option>
              <option selected>50</option>
              <option>100</option>
            </select>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn accent" type="submit">Search</button>
            <button class="btn" type="button" id="resetBtn">Reset</button>
          </div>
        </div>
        <div class="col-3">
          <label>Quick Actions</label>
          <div class="pill hl" id="exportCsv" style="justify-content:space-between;cursor:pointer" title="Download current results as CSV">📥 Export CSV</div>
        </div>
      </form>

      <div class="results" id="results">
        <div class="meta">
          <small id="resultCount">Use the search to load results.</small>
          <div style="display:flex; gap:6px">
            <button class="btn" id="prevBtn" disabled>← Prev</button>
            <button class="btn" id="nextBtn" disabled>Next →</button>
          </div>
        </div>
        <div style="overflow:auto">
          <table id="table" hidden>
            <thead>
              <tr>
                <th style="min-width:220px">Name</th>
                <th style="min-width:200px">Job Title</th>
                <th>Department</th>
                <th>Pay Type</th>
                <th class="num">Annual Salary</th>
                <th class="num">Hourly Rate</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="notice">
          <small>Data source: City of Chicago — “Current Employee Names, Salaries, and Position Titles” (resource <code>xzkq-xp2w</code>). Fetched live via proxy.</small>
        </div>
      </div>
    </div>
  </div>

  <script>
    // ======== CONFIG ========
    const DATASET = "xzkq-xp2w";
    const SOC_BASE_JSON = `https://data.cityofchicago.org/resource/${DATASET}.json`;
    const SOC_BASE_CSV  = `https://data.cityofchicago.org/resource/${DATASET}.csv`;
    const PROXY_JSON = `/api/salaries.php`;
    const PROXY_CSV  = `/api/salaries.php?csv=1`;

    // ======== UTIL ========
    const $ = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
    const escapeSoql = (s) => String(s).replaceAll("'", "''");
    const fmt = new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});

    function buildWhere(params){
      const where = [];
      if(params.name){ const v = escapeSoql(params.name.trim()); where.push(`upper(name) like upper('%${v}%')`); }
      if(params.dept){ const v = escapeSoql(params.dept); where.push(`department='${v}'`); }
      if(params.title){ const v = escapeSoql(params.title.trim()); where.push(`upper(job_titles) like upper('%${v}%')`); }
      if(params.payType){ where.push(`salary_or_hourly='${params.payType}'`); }
      if(params.ft){ where.push(`full_or_part_time='${params.ft}'`); }
      const min = Number(params.minSal||'');
      const max = Number(params.maxSal||'');
      if(!Number.isNaN(min) && min>0){ where.push(`employee_annual_salary >= ${min}`); }
      if(!Number.isNaN(max) && max>0){ where.push(`employee_annual_salary <= ${max}`); }
      return where.join(' AND ');
    }

    function paramsFromForm(){
      return {
        name: $('#name').value,
        dept: $('#dept').value,
        title: $('#title').value,
        minSal: $('#minSal').value,
        maxSal: $('#maxSal').value,
        ft: $('#ft').value,
        payType: $('#payType').value,
        sortBy: $('#sortBy').value,
        limit: Number($('#limit').value)
      };
    }

    function writeURLFromForm(){
      const p = paramsFromForm();
      const usp = new URLSearchParams();
      Object.entries(p).forEach(([k,v]) => { if(String(v||'').trim()!=='') usp.set(k, v); });
      if(pageOffset) usp.set('offset', String(pageOffset));
      history.replaceState(null, '', location.pathname + (usp.toString() ? '?' + usp.toString() : ''));
    }

    function readFormFromURL(){
      const q = new URLSearchParams(location.search);
      const set = (id, key=id) => { if(q.has(key)) $( '#' + id ).value = q.get(key); };
      set('name'); set('dept'); set('title'); set('minSal'); set('maxSal');
      set('ft'); set('payType'); set('sortBy'); set('limit');
      pageOffset = Number(q.get('offset')||0);
    }

    let pageOffset = 0;

    function proxiedFetchJSON(buildURL) {
      const real = buildURL();
      const url = new URL(PROXY_JSON, location.origin);
      url.searchParams.set('url', real);
      return fetch(url).then(r => { if(!r.ok) throw new Error(`Proxy HTTP ${r.status}`); return r.json(); });
    }
    function proxiedCSVUrl(buildURL) {
      const real = buildURL();
      const url = new URL(PROXY_CSV, location.origin);
      url.searchParams.set('url', real);
      return url.toString();
    }

    async function fetchCount(where){
      return proxiedFetchJSON(() => {
        const u = new URL(SOC_BASE_JSON);
        u.searchParams.set('$select', 'count(1) as c');
        if(where) u.searchParams.set('$where', where);
        return u.toString();
      }).then(r => (r?.[0]?.c ? Number(r[0].c) : 0));
    }

    async function fetchPage(where, order, limit, offset){
      return proxiedFetchJSON(() => {
        const u = new URL(SOC_BASE_JSON);
        u.searchParams.set('$select', [
          'name','job_titles','department','salary_or_hourly','employee_annual_salary','hourly_rate','full_or_part_time'
        ].join(','));
        if(where) u.searchParams.set('$where', where);
        if(order) u.searchParams.set('$order', order);
        u.searchParams.set('$limit', String(limit));
        u.searchParams.set('$offset', String(offset));
        return u.toString();
      });
    }

    function renderRows(rows){
      const tbody = $('#table tbody');
      tbody.innerHTML = '';
      for(const r of rows){
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${r.name || ''}</strong><br><span class="badge">${r.full_or_part_time==='F' ? 'Full-time' : r.full_or_part_time==='P' ? 'Part-time' : (r.full_or_part_time||'')}</span></td>
          <td>${r.job_titles || ''}</td>
          <td>${r.department || ''}</td>
          <td>${r.salary_or_hourly || ''}</td>
          <td class="num">${r.employee_annual_salary ? fmt.format(Number(r.employee_annual_salary)) : ''}</td>
          <td class="num">${r.hourly_rate ? fmt.format(Number(r.hourly_rate)) : ''}</td>
        `;
        tbody.appendChild(tr);
      }
      $('#table').hidden = rows.length === 0;
    }

    function setPager(total, limit){
      const start = total === 0 ? 0 : pageOffset + 1;
      const end = Math.min(pageOffset + limit, total);
      $('#resultCount').textContent = total ? `Showing ${start}–${end} of ${total} employees` : 'No results.';
      $('#prevBtn').disabled = pageOffset === 0;
      $('#nextBtn').disabled = pageOffset + limit >= total;
    }

    function updateCsvLink(where){
      const csvLink = proxiedCSVUrl(() => {
        const u = new URL(SOC_BASE_CSV);
        u.searchParams.set('$select','name,job_titles,department,salary_or_hourly,employee_annual_salary,hourly_rate,full_or_part_time');
        if(where) u.searchParams.set('$where', where);
        u.searchParams.set('$order', ($('#sortBy').value));
        u.searchParams.set('$limit','50000');
        return u.toString();
      });
      $('#exportCsv').onclick = () => window.open(csvLink, '_blank');
    }

    async function runSearch(resetOffset=false){
      const params = paramsFromForm();
      if(resetOffset) pageOffset = 0;
      const where = buildWhere(params);
      $('#resultCount').innerHTML = '<span class="skeleton" style="display:inline-block;width:220px"></span>';
      updateCsvLink(where);
      try {
        const [total, rows] = await Promise.all([
          fetchCount(where),
          fetchPage(where, params.sortBy, params.limit, pageOffset)
        ]);
        renderRows(rows);
        setPager(total, params.limit);
      } catch(err) {
        console.error(err);
        $('#resultCount').textContent = 'Error loading data. Try again in a moment.';
      }
      writeURLFromForm();
    }

    // Pagination
    $('#prevBtn').addEventListener('click', () => { const {limit} = paramsFromForm(); pageOffset = Math.max(0, pageOffset - limit); runSearch(false); });
    $('#nextBtn').addEventListener('click', () => { const {limit} = paramsFromForm(); pageOffset += limit; runSearch(false); });

    // Form submit / reset
    $('#searchForm').addEventListener('submit', (e) => { e.preventDefault(); runSearch(true); });
    $('#resetBtn').addEventListener('click', () => { $('#searchForm').reset(); pageOffset=0; $('#dept').value=''; $('#payType').value=''; $('#ft').value=''; runSearch(true); });

    // Saved searches
    const PRESETS = {
      top100:        () => ({ minSal:'0', dept:'',       title:'',     ft:'', payType:'', sortBy:'employee_annual_salary DESC', limit:100 }),
      police200:     () => ({ minSal:'200000', dept:'POLICE', title:'', ft:'', payType:'', sortBy:'employee_annual_salary DESC', limit:50 }),
      fire200:       () => ({ minSal:'200000', dept:'FIRE',   title:'', ft:'', payType:'', sortBy:'employee_annual_salary DESC', limit:50 }),
      'overtitle-chief': () => ({ title:'CHIEF', sortBy:'employee_annual_salary DESC', limit:100 })
    };
    $$('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = PRESETS[btn.dataset.preset]();
        if('minSal' in p) $('#minSal').value = p.minSal || '';
        if('dept' in p)   $('#dept').value   = p.dept || '';
        if('title' in p)  $('#title').value  = p.title || '';
        if('ft' in p)     $('#ft').value     = p.ft || '';
        if('payType' in p)$('#payType').value= p.payType || '';
        if('sortBy' in p) $('#sortBy').value = p.sortBy;
        if('limit' in p)  $('#limit').value  = String(p.limit);
        pageOffset = 0; runSearch(true);
      });
    });

    // Populate departments via distinct group
    async function loadDepartments(){
      try{
        const rows = await proxiedFetchJSON(() => {
          const u = new URL(SOC_BASE_JSON);
          u.searchParams.set('$select', 'department');
          u.searchParams.set('$group', 'department');
          u.searchParams.set('$order', 'department');
          return u.toString();
        });
        const sel = $('#dept');
        for(const r of rows){ if(!r.department) continue; const opt = document.createElement('option'); opt.value = r.department; opt.textContent = r.department; sel.appendChild(opt); }
      }catch(e){ console.warn('Dept load failed', e); }
    }

    // Init
    window.addEventListener('DOMContentLoaded', () => {
      loadDepartments();
      readFormFromURL();
      if(!location.search){ // default landing: Top earners
        $('#minSal').value = '200000';
      }
      runSearch(true);
    });
  </script>
</body>
</html>
```

---

## 3) Optional snapshots via **Cron + PHP** (no Git needed)

**Goal:** Generate static JSON files nightly for instant pages & SEO.

### 3a) `/public_html/cron/fetch_salaries.php`

```php
<?php
// /public_html/cron/fetch_salaries.php
// Nightly snapshotter for common cohorts. Writes JSON to /public_html/data/

$APP_TOKEN = 'REPLACE_WITH_YOUR_SOCRATA_APP_TOKEN';
$DATASET = 'xzkq-xp2w';
$BASE = "https://data.cityofchicago.org/resource/$DATASET.json";
$OUTDIR = __DIR__ . '/../data';
if(!is_dir($OUTDIR)) mkdir($OUTDIR, 0755, true);

function fetch_json($url, $token){
  $ch = curl_init($url);
  $headers = [];
  if($token) $headers[] = 'X-App-Token: ' . $token;
  curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>true,CURLOPT_TIMEOUT=>30,CURLOPT_HTTPHEADER=>$headers]);
  $resp = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if($code >= 200 && $code < 300){ return json_decode($resp, true); }
  throw new Exception("HTTP $code from Socrata");
}

function soql($select,$where,$order,$limit){
  global $BASE;
  $u = $BASE . '?$select=' . rawurlencode($select);
  if($where) $u .= '&$where=' . rawurlencode($where);
  if($order) $u .= '&$order=' . rawurlencode($order);
  if($limit) $u .= '&$limit=' . intval($limit);
  return $u;
}

try {
  $select = 'name,job_titles,department,salary_or_hourly,employee_annual_salary,hourly_rate,full_or_part_time';

  $jobs = [
    ['file'=>'top_earners.json', 'url'=> soql($select, null, 'employee_annual_salary DESC', 500)],
    ['file'=>'police_200k.json','url'=> soql($select, "department='POLICE' AND employee_annual_salary >= 200000", 'employee_annual_salary DESC', 500)],
    ['file'=>'fire_200k.json',  'url'=> soql($select, "department='FIRE' AND employee_annual_salary >= 200000", 'employee_annual_salary DESC', 500)],
  ];

  foreach($jobs as $j){
    $data = fetch_json($j['url'], $APP_TOKEN);
    file_put_contents($OUTDIR . '/' . $j['file'], json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
  }

  echo "OK\n";
} catch(Exception $e){
  http_response_code(500);
  echo 'ERROR: ' . $e->getMessage();
}
```

**Cron setup (Hostinger → Advanced → Cron Jobs):**

- **Command** (adjust PHP path if needed):
  ```bash
  /usr/bin/php /home/USER/public_html/cron/fetch_salaries.php >/home/USER/cron.logs/salaries.log 2>&1
  ```
- **Schedule:** Daily at 2:15 AM.
- Create folder `/home/USER/cron.logs/` once to collect logs.

Resulting files:

- `/public_html/data/top_earners.json`
- `/public_html/data/police_200k.json`
- `/public_html/data/fire_200k.json`

---

## 4) Optional static page: `/public_html/top-earners.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Chicago’s Top Earners — Snapshot</title>
  <style>
    body{margin:0;background:#0b0c10;color:#e8e9ee;font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto}
    .wrap{max-width:1100px;margin:48px auto;padding:0 16px}
    h1{font-size:28px;margin:0 0 16px}
    .card{background:#111218;border:1px solid #242632;border-radius:16px;padding:18px}
    table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid #242632;border-radius:12px;overflow:hidden}
    thead th{font-size:12px;color:#a9adbf;text-align:left;background:#0f1016;padding:10px 12px;border-bottom:1px solid #242632}
    tbody td{padding:12px;border-bottom:1px solid #242632}
    .num{text-align:right;font-variant-numeric:tabular-nums}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Chicago’s Top Earners</h1>
    <div class="card">
      <p style="margin-top:0;color:#a9adbf">Nightly snapshot. For live search with filters and CSV export, visit <a href="/salaries.html">Salaries Search</a>.</p>
      <div id="status">Loading…</div>
      <div style="overflow:auto">
        <table id="table" hidden>
          <thead>
            <tr>
              <th>Name</th><th>Title</th><th>Department</th><th>Pay Type</th><th class="num">Annual Salary</th><th class="num">Hourly</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
  <script>
    const fmt = new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
    fetch('/data/top_earners.json').then(r=>r.json()).then(rows=>{
      const tbody = document.querySelector('#table tbody');
      for(const r of rows){
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>${r.name||''}</strong></td><td>${r.job_titles||''}</td><td>${r.department||''}</td><td>${r.salary_or_hourly||''}</td><td class="num">${r.employee_annual_salary?fmt.format(Number(r.employee_annual_salary)):''}</td><td class="num">${r.hourly_rate?fmt.format(Number(r.hourly_rate)):''}</td>`;
        tbody.appendChild(tr);
      }
      document.getElementById('status').remove();
      document.getElementById('table').hidden=false;
    }).catch(()=>{ document.getElementById('status').textContent='Failed to load snapshot.'; });
  </script>
</body>
</html>
```

---

## 5) Navigation + robots

- Add a nav link to **Salaries** → `/salaries.html` and optionally **Top Earners** → `/top-earners.html`.
- Ensure `robots.txt` allows crawling in production, and disallows on any staging domain.

---

## 6) Quick test plan

1. Upload `api/salaries.php` and set your token.
2. Upload `salaries.html` and visit `/salaries.html`.
3. Click each preset; verify results and CSV export.
4. Create `/cron/fetch_salaries.php`, run it once in the browser to generate `/data/*.json`.
5. Visit `/top-earners.html` to verify the snapshot renders.

You now have:

- **Live, token-safe search** with shareable URLs and CSV export.
- **Static snapshot pages** you can style and link from the homepage for fast SEO wins.

