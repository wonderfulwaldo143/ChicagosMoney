<?php
/**
 * Chicago's Money - Configuration File
 * Loads environment variables and configuration settings
 */

// Load environment variables from .env file if it exists
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;

        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        if (!array_key_exists($key, $_ENV)) {
            $_ENV[$key] = $value;
        }
    }
}

// Configuration constants
define('SOCRATA_APP_TOKEN', getenv('SOCRATA_APP_TOKEN') ?: $_ENV['SOCRATA_APP_TOKEN'] ?? '');
define('SOCRATA_API_DOMAIN', getenv('SOCRATA_API_DOMAIN') ?: $_ENV['SOCRATA_API_DOMAIN'] ?? 'data.cityofchicago.org');
define('APP_ENV', getenv('APP_ENV') ?: $_ENV['APP_ENV'] ?? 'production');
define('DEBUG_MODE', filter_var(getenv('DEBUG_MODE') ?: $_ENV['DEBUG_MODE'] ?? 'false', FILTER_VALIDATE_BOOLEAN));

// CORS Configuration
$allowed_origins = [
    'https://chicagosmoney.com',
    'https://www.chicagosmoney.com'
];

// Add localhost for development
if (APP_ENV === 'development') {
    $allowed_origins[] = 'http://localhost';
    $allowed_origins[] = 'http://localhost:8000';
}

define('ALLOWED_ORIGINS', $allowed_origins);

/**
 * Set CORS headers based on request origin
 */
function set_cors_headers() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, ALLOWED_ORIGINS, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8');
}
