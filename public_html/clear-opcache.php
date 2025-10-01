<?php
/**
 * Force clear all PHP caches
 * Access: https://chicagosmoney.com/clear-opcache.php
 */

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

echo "🔄 Attempting to clear all caches...\n\n";

// Try to clear OPcache
if (function_exists('opcache_reset')) {
    if (opcache_reset()) {
        echo "✅ OPcache cleared successfully\n";
    } else {
        echo "⚠️  OPcache reset failed (may need admin privileges)\n";
    }
} else {
    echo "ℹ️  OPcache is not enabled or not available\n";
}

// Clear all user cache (realpath cache)
if (function_exists('clearstatcache')) {
    clearstatcache(true);
    echo "✅ Stat cache cleared\n";
}

// Show OPcache status
if (function_exists('opcache_get_status')) {
    $status = opcache_get_status(false);
    if ($status !== false) {
        echo "\n📊 OPcache Status:\n";
        echo "  - Enabled: " . ($status['opcache_enabled'] ? 'Yes' : 'No') . "\n";
        echo "  - Cache full: " . ($status['cache_full'] ? 'Yes' : 'No') . "\n";
        echo "  - Cached scripts: " . $status['opcache_statistics']['num_cached_scripts'] . "\n";
    }
}

echo "\n🔍 Testing if version.txt exists:\n";
$vfile = __DIR__ . '/version.txt';
echo "  - Path: $vfile\n";
echo "  - Exists: " . (file_exists($vfile) ? 'Yes' : 'No') . "\n";
if (file_exists($vfile)) {
    echo "  - Content: " . file_get_contents($vfile) . "\n";
}

echo "\n🔍 Testing if test.txt exists:\n";
$tfile = __DIR__ . '/test.txt';
echo "  - Path: $tfile\n";
echo "  - Exists: " . (file_exists($tfile) ? 'Yes' : 'No') . "\n";
if (file_exists($tfile)) {
    echo "  - Content: " . substr(file_get_contents($tfile), 0, 100) . "\n";
}

echo "\n✅ Cache clear attempt complete!\n";
echo "Now try accessing: https://chicagosmoney.com/test.txt\n";
