<?php
/**
 * Clear Browser Cache Headers
 * Access: https://chicagosmoney.com/clear-cache.php
 *
 * This script sends aggressive no-cache headers to help debug caching issues
 */

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: 0');
header('Expires: Sat, 01 Jan 2000 00:00:00 GMT');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

$version_file = __DIR__ . '/version.txt';
$version = file_exists($version_file) ? file_get_contents($version_file) : 'Not found';
$server_time = date('Y-m-d H:i:s T');
$check_time = time();

?>
<!DOCTYPE html>
<html>
<head>
    <title>Cache Clear - Chicago's Money</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <style>
        body {
            font-family: monospace;
            background: #0a0d1a;
            color: #e8ebff;
            padding: 2rem;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(18, 20, 34, 0.95);
            border: 1px solid #7cd0ff;
            border-radius: 8px;
            padding: 2rem;
        }
        h1 { color: #7cd0ff; }
        .success { color: #00c851; }
        .warning { color: #ffb000; }
        code {
            background: rgba(0, 0, 0, 0.4);
            padding: 2px 6px;
            border-radius: 3px;
        }
        .box {
            background: rgba(10, 13, 26, 0.65);
            padding: 1rem;
            margin: 1rem 0;
            border-left: 3px solid #00c851;
            border-radius: 4px;
        }
        button {
            background: #0047AB;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            margin: 0.5rem 0.5rem 0.5rem 0;
        }
        button:hover {
            background: #003380;
        }
        a {
            color: #7cd0ff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔄 Cache Status Check</h1>

        <div class="box">
            <p class="success"><strong>✅ This page loaded with no-cache headers</strong></p>
            <p>Server time: <code><?= $server_time ?></code></p>
            <p>Check ID: <code><?= $check_time ?></code></p>
        </div>

        <h2>Current Deployment Version</h2>
        <div class="box">
            <pre><?= htmlspecialchars($version) ?></pre>
        </div>

        <h2>Test File Freshness</h2>
        <div class="box">
            <p>Click these buttons to test if files are cached:</p>
            <button onclick="testFile('/version.txt')">Test version.txt</button>
            <button onclick="testFile('/styles.css')">Test CSS</button>
            <button onclick="testFile('/script.js')">Test JS</button>
            <button onclick="testFile('/index.html')">Test HTML</button>

            <div id="results" style="margin-top: 1rem;"></div>
        </div>

        <h2>Manual Cache Clear Steps</h2>
        <div class="box">
            <ol>
                <li><strong>Hostinger hPanel:</strong>
                    <ul>
                        <li>Log in to hPanel</li>
                        <li>Go to: <strong>Advanced → Website → Clear Website Cache</strong></li>
                        <li>Click "Clear Cache" or "Flush cache"</li>
                    </ul>
                </li>
                <li><strong>Browser:</strong>
                    <ul>
                        <li>Windows/Linux: <code>Ctrl + Shift + R</code></li>
                        <li>Mac: <code>Cmd + Shift + R</code></li>
                        <li>Or use Incognito/Private mode</li>
                    </ul>
                </li>
            </ol>
        </div>

        <p style="text-align: center; margin-top: 2rem;">
            <a href="/deploy-info.php">View Full Deploy Info</a> |
            <a href="/">Back to Home</a>
        </p>
    </div>

    <script>
        function testFile(url) {
            const resultsDiv = document.getElementById('results');
            const cacheBuster = '?cb=' + Date.now();

            resultsDiv.innerHTML = '<p class="warning">⏳ Testing ' + url + '...</p>';

            fetch(url + cacheBuster, { cache: 'no-store' })
                .then(response => {
                    const headers = {};
                    for (let [key, value] of response.headers.entries()) {
                        headers[key] = value;
                    }

                    return response.text().then(text => ({
                        status: response.status,
                        headers: headers,
                        body: text.substring(0, 200)
                    }));
                })
                .then(data => {
                    let html = '<div class="box">';
                    html += '<p><strong>File:</strong> <code>' + url + '</code></p>';
                    html += '<p><strong>Status:</strong> ' + data.status + '</p>';
                    html += '<p><strong>Cache-Control:</strong> <code>' + (data.headers['cache-control'] || 'not set') + '</code></p>';
                    html += '<p><strong>Last-Modified:</strong> <code>' + (data.headers['last-modified'] || 'not set') + '</code></p>';
                    html += '<p><strong>First 200 chars:</strong></p>';
                    html += '<pre style="white-space: pre-wrap; word-break: break-all;">' + data.body + '</pre>';
                    html += '</div>';
                    resultsDiv.innerHTML = html;
                })
                .catch(error => {
                    resultsDiv.innerHTML = '<p class="warning">❌ Error: ' + error.message + '</p>';
                });
        }
    </script>
</body>
</html>
