<?php
header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

$vfile = __DIR__ . '/version.txt';

if (file_exists($vfile)) {
    echo file_get_contents($vfile);
} else {
    echo "ERROR: version.txt not found at: " . $vfile . "\n";
    echo "Directory contents:\n";
    $files = scandir(__DIR__);
    foreach ($files as $file) {
        if ($file[0] != '.') {
            echo "  - $file\n";
        }
    }
}
