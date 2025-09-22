<?php
// /public_html/api/snapshot.php
// Generates a simple social preview PNG for the budget dashboard share links.

header('Access-Control-Allow-Origin: *');

// We will render a static PNG using GD with brand colors. No external fonts.

$width = 1200;
$height = 630;

$department = isset($_GET['department']) ? urldecode(trim($_GET['department'])) : 'City of Chicago';
$metric = isset($_GET['metric']) ? strtolower(trim($_GET['metric'])) : 'payroll';
$valueRaw = isset($_GET['value']) ? trim($_GET['value']) : '';

$metricLabel = [
  'payroll' => 'Total Payroll',
  'overtime' => 'Overtime Spend',
  'headcount' => 'Active Headcount'
][$metric] ?? 'City Insight';

if ($metric === 'headcount') {
  $value = number_format((int)$valueRaw);
} else {
  $valueNumeric = is_numeric($valueRaw) ? (float) $valueRaw : 0;
  $value = formatCurrency($valueNumeric);
}

$im = imagecreatetruecolor($width, $height);

// Colors
$bg = imagecolorallocate($im, 5, 6, 15);
$bgAccent = imagecolorallocatealpha($im, 20, 26, 53, 60);
$textPrimary = imagecolorallocate($im, 232, 235, 255);
$textSecondary = imagecolorallocate($im, 162, 176, 215);
$gold = imagecolorallocate($im, 255, 209, 102);
$blue = imagecolorallocate($im, 124, 208, 255);

imagefill($im, 0, 0, $bg);

// Mesh accent rectangles
imagefilledrectangle($im, -200, 100, 800, 540, $bgAccent);
imagefilledrectangle($im, 400, -150, 1400, 380, imagecolorallocatealpha($im, 40, 56, 120, 70));

// Draw title
$fontCandidates = [
  __DIR__ . '/fonts/Manrope-Bold.ttf',
  __DIR__ . '/fonts/OpenSans-Bold.ttf',
  __DIR__ . '/fonts/Arial Bold.ttf',
  __DIR__ . '/fonts/DejaVuSans-Bold.ttf'
];

$font = null;
foreach ($fontCandidates as $candidate) {
  if (file_exists($candidate)) {
    $font = $candidate;
    break;
  }
}
$useTtf = $font !== null;

$title = "Chicago's Money";
drawText($im, $title, 42, 80, 130, $textPrimary, $font, $useTtf);

drawText($im, 'Budget Dashboard Highlight', 22, 80, 190, $textSecondary, $font, $useTtf);

// Department box
$departmentText = strtoupper($department);
drawText($im, $metricLabel, 26, 80, 280, $gold, $font, $useTtf);
drawText($im, $value, 52, 80, 360, $textPrimary, $font, $useTtf);

$deptLines = wrapText($departmentText, 28, $font, 880, $useTtf);
$yStart = 450;
foreach ($deptLines as $line) {
  drawText($im, $line, 28, 80, $yStart, $blue, $font, $useTtf);
  $yStart += 44;
}

// Footer
$footer = 'Live data • data.cityofchicago.org';
drawText($im, $footer, 20, 80, $height - 60, $textSecondary, $font, $useTtf);

header('Content-Type: image/png');
imagepng($im);
imagedestroy($im);
exit;

function wrapText(string $text, int $size, ?string $font, int $maxWidth, bool $useTtf): array
{
  $words = preg_split('/\s+/', $text);
  $lines = [];
  $current = '';
  foreach ($words as $word) {
    $test = trim($current . ' ' . $word);
    if ($useTtf && $font) {
      $box = imagettfbbox($size, 0, $font, $test);
      $width = $box[2] - $box[0];
    } else {
      $width = strlen($test) * ($size * 0.55);
    }
    if ($width > $maxWidth && $current !== '') {
      $lines[] = trim($current);
      $current = $word;
    } else {
      $current = $test;
    }
  }
  if ($current !== '') {
    $lines[] = trim($current);
  }
  return $lines ?: [$text];
}

function drawText($image, string $text, int $size, int $x, int $y, int $color, ?string $font, bool $useTtf): void
{
  if ($useTtf && $font) {
    imagettftext($image, $size, 0, $x, $y, $color, $font, $text);
    return;
  }

  $gdFont = max(1, min(5, (int) round($size / 10)));
  $lineHeight = imagefontheight($gdFont);
  $yTop = max(0, $y - $lineHeight);
  imagestring($image, $gdFont, $x, $yTop, $text, $color);
}

function formatCurrency(float $value): string
{
  if ($value >= 1_000_000_000) {
    return '$' . round($value / 1_000_000_000, 2) . 'B';
  }
  if ($value >= 1_000_000) {
    return '$' . round($value / 1_000_000, 2) . 'M';
  }
  if ($value >= 1_000) {
    return '$' . round($value / 1_000, 1) . 'K';
  }
  return '$' . number_format($value, 0);
}
