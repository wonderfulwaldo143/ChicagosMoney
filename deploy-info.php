<?php
/**
 * Deployment Information and Cache Verification Script
 * Access: https://chicagosmoney.com/deploy-info.php
 */

// Security: Only allow access from specific IPs or with a secret key (optional)
// Uncomment and configure if you want to restrict access:
// $allowed_ips = ['your.ip.address.here'];
// if (!in_array($_SERVER['REMOTE_ADDR'], $allowed_ips)) {
//     header('HTTP/1.1 403 Forbidden');
//     exit('Access denied');
// }

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chicago's Money - Deployment Info</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Courier New', monospace;
            background: #0a0d1a;
            color: #e8ebff;
            padding: 2rem;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(18, 20, 34, 0.95);
            border: 1px solid rgba(124, 208, 255, 0.2);
            border-radius: 12px;
            padding: 2rem;
        }
        h1 {
            color: #7cd0ff;
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
        }
        h2 {
            color: #89f8d4;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        .info-block {
            background: rgba(10, 13, 26, 0.65);
            border-left: 3px solid #00c851;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 4px;
        }
        .status-ok { border-left-color: #00c851; }
        .status-warn { border-left-color: #ffb000; }
        .status-error { border-left-color: #ce1141; }
        code {
            background: rgba(0, 0, 0, 0.4);
            padding: 2px 6px;
            border-radius: 3px;
            color: #ffda7b;
        }
        pre {
            background: rgba(0, 0, 0, 0.4);
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 0.5rem 0;
        }
        .timestamp {
            color: #a0a8c0;
            font-size: 0.9rem;
        }
        a {
            color: #7cd0ff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid rgba(124, 208, 255, 0.1);
        }
        th {
            color: #89f8d4;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Chicago's Money - Deployment Info</h1>
        <p class="timestamp">Generated: <?= date('Y-m-d H:i:s T') ?></p>

        <h2>📦 Version Information</h2>
        <div class="info-block status-ok">
            <?php
            $version_file = __DIR__ . '/version.txt';
            if (file_exists($version_file)) {
                $version_content = file_get_contents($version_file);
                echo "<strong>Current Version:</strong><br>";
                echo "<pre>" . htmlspecialchars($version_content) . "</pre>";

                // Parse version info
                $parts = explode(' ', trim($version_content));
                if (count($parts) >= 2) {
                    echo "<p>Commit SHA: <code>{$parts[0]}</code></p>";
                    echo "<p>Deployed at: <code>{$parts[1]}</code></p>";
                }
            } else {
                echo "<strong>⚠️  version.txt not found</strong>";
            }
            ?>
        </div>

        <h2>📁 File Status</h2>
        <table>
            <thead>
                <tr>
                    <th>File</th>
                    <th>Last Modified</th>
                    <th>Size</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $files = [
                    'index.html',
                    'styles.css',
                    'script.js',
                    'version.txt',
                    '.htaccess'
                ];

                foreach ($files as $file) {
                    $path = __DIR__ . '/' . $file;
                    if (file_exists($path)) {
                        $mtime = filemtime($path);
                        $size = filesize($path);
                        echo "<tr>";
                        echo "<td><code>{$file}</code></td>";
                        echo "<td>" . date('Y-m-d H:i:s', $mtime) . "</td>";
                        echo "<td>" . number_format($size) . " bytes</td>";
                        echo "</tr>";
                    } else {
                        echo "<tr>";
                        echo "<td><code>{$file}</code></td>";
                        echo "<td colspan='2'><em>Not found</em></td>";
                        echo "</tr>";
                    }
                }
                ?>
            </tbody>
        </table>

        <h2>🌐 Server Information</h2>
        <div class="info-block status-ok">
            <p><strong>Server Time:</strong> <?= date('Y-m-d H:i:s T') ?></p>
            <p><strong>PHP Version:</strong> <?= phpversion() ?></p>
            <p><strong>Server Software:</strong> <?= $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown' ?></p>
            <p><strong>Document Root:</strong> <code><?= $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown' ?></code></p>
        </div>

        <h2>🔍 Cache Headers Test</h2>
        <div class="info-block status-warn">
            <p>Check if files are being cached correctly:</p>
            <ul style="list-style: none; padding-left: 0;">
                <li>• <a href="/styles.css?t=<?= time() ?>" target="_blank">Test CSS Cache</a></li>
                <li>• <a href="/script.js?t=<?= time() ?>" target="_blank">Test JS Cache</a></li>
                <li>• <a href="/index.html?t=<?= time() ?>" target="_blank">Test HTML Cache</a></li>
                <li>• <a href="/version.txt?t=<?= time() ?>" target="_blank">Test version.txt</a></li>
            </ul>
        </div>

        <h2>💡 Manual Cache Clear Instructions</h2>
        <div class="info-block status-warn">
            <p>If the site isn't updating after deployment:</p>
            <ol style="padding-left: 1.5rem;">
                <li>Log into Hostinger Control Panel (hPanel)</li>
                <li>Navigate to: <strong>Advanced → Website → Clear Website Cache</strong></li>
                <li>Click "Clear Cache" button</li>
                <li>Wait 1-2 minutes and refresh the site</li>
            </ol>
            <p style="margin-top: 1rem;">Or use browser cache bypass: <code>Ctrl+Shift+R</code> (Windows) or <code>Cmd+Shift+R</code> (Mac)</p>
        </div>

        <p style="margin-top: 2rem; text-align: center; color: #a0a8c0;">
            <a href="/">← Back to Chicago's Money</a>
        </p>
    </div>
</body>
</html>
