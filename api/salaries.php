<?php
// /public_html/api/salaries.php
// Proxies Socrata requests for the Current Employee Names, Salaries dataset (xzkq-xp2w)
// Usage:
//   ?url=<full Socrata JSON URL>        -> returns JSON
//   ?csv=1&url=<full Socrata CSV URL>   -> returns CSV
//
// SECURITY: Only forwards to data.cityofchicago.org/resource/xzkq-xp2w.(json|csv)

$APP_TOKEN = 'bctos95775igogxkalare3rhu';

if (!isset($_GET['url'])) {
  http_response_code(400);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['error' => 'Missing url parameter']);
  exit;
}

$target = $_GET['url'];

// Normalise any double-encoding applied by nested URLSearchParams
if (is_string($target)) {
  $previous = null;
  while ($previous !== $target) {
    $previous = $target;
    $target = rawurldecode($target);
  }
}

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
$query = '';
if (!empty($parts['query'])) {
  $pairs = explode('&', $parts['query']);
  $encodedPairs = [];
  foreach ($pairs as $pair) {
    if ($pair === '') {
      continue;
    }
    $kv = explode('=', $pair, 2);
    $key = rawurlencode(rawurldecode($kv[0]));
    if (array_key_exists(1, $kv)) {
      $value = rawurlencode(urldecode($kv[1]));
      $encodedPairs[] = $key . '=' . $value;
    } else {
      $encodedPairs[] = $key;
    }
  }
  $query = implode('&', $encodedPairs);
}
$finalUrl = $scheme . '://' . $parts['host'] . $parts['path'] . ($query ? '?' . $query : '');

function proxy_request(string $url, array $headers): array {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => $headers
  ]);

  $body = curl_exec($ch);
  $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  return [$body, (int)$http];
}

$headers = [];
if (!empty($APP_TOKEN)) {
  $headers[] = 'X-App-Token: ' . $APP_TOKEN;
}

[$resp, $http] = proxy_request($finalUrl, $headers);

// Fallback without the provided token if it appears invalid (403 + permission_denied).
if (!empty($APP_TOKEN) && $http === 403 && strpos($parts['path'], '.json') !== false) {
  $decoded = json_decode($resp, true);
  if (is_array($decoded) && ($decoded['code'] ?? '') === 'permission_denied') {
    [$resp, $http] = proxy_request($finalUrl, []);
  }
}

$contentType = (strpos($parts['path'], '.csv') !== false)
  ? 'text/csv; charset=utf-8'
  : 'application/json; charset=utf-8';

if ($http >= 200 && $http < 300) {
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: ' . $contentType);
  echo $resp;
  exit;
}

http_response_code($http ?: 502);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Upstream error', 'status' => $http]);
