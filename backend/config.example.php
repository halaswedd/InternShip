<?php
require_once "db.php";
require_once "logger.php";
require_once "notifier.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$secret_key = "YOUR_SECRET_KEY";
$gemini_api_key = "YOUR_GEMINI_API_KEY";