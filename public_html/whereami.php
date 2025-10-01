<?php
echo "DOCUMENT_ROOT: " . realpath($_SERVER['DOCUMENT_ROOT']) . "\n";
echo "CWD: " . getcwd() . "\n";
echo "FILE: " . __FILE__ . "\n";
echo "SCRIPT_FILENAME: " . $_SERVER['SCRIPT_FILENAME'] . "\n";
