<?php
// Aggregated payroll summary endpoint for the budget dashboard.
// Returns JSON with total payroll, overtime and headcount.

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

$APP_TOKEN = 'bctos95775igogxkalare3rhu';
$DATASET = 'https://data.cityofchicago.org/resource/xzkq-xp2w.json';

$summary = [
  'payroll' => null,
  'overtime' => null,
  'headcount' => null,
];

try {
  $summary['payroll'] = run_query('$select=sum(annual_salary) as total', $APP_TOKEN, $DATASET);
  $summary['overtime'] = run_query("$select=sum(case when upper(salary_or_hourly)='HOURLY' then hourly_rate*2080 else 0 end) as total", $APP_TOKEN, $DATASET);
  $summary['headcount'] = run_query('$select=count(1) as total', $APP_TOKEN, $DATASET);

  echo json_encode([
    'total_payroll' => numeric_value($summary['payroll']),
    'total_overtime' => numeric_value($summary['overtime']),
    'headcount' => (int) numeric_value($summary['headcount'])
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'summary_failed', 'message' => $e->getMessage()]);
}

function run_query(string $selectClause, string $token, string $dataset): ?array
{
  $url = sprintf('%s?%s', $dataset, rawurlencode('$select') . '=' . rawurlencode($selectClause));
  $ch = curl_init($url);
  $headers = [];
  if ($token) {
    $headers[] = 'X-App-Token: ' . $token;
  }
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_HTTPHEADER => $headers
  ]);

  $response = curl_exec($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($status < 200 || $status >= 300) {
    throw new RuntimeException('Upstream status ' . $status . ' for query ' . $selectClause);
  }

  $data = json_decode($response, true);
  if (!is_array($data)) {
    throw new RuntimeException('Invalid JSON response for query ' . $selectClause);
  }

  return $data;
}

function numeric_value(?array $rows): float
{
  if (!$rows || !isset($rows[0])) return 0.0;
  $row = $rows[0];
  $value = current($row);
  return is_numeric($value) ? (float)$value : 0.0;
}
