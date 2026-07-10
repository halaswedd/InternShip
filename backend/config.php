<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$host = "localhost";
$db_username = "root";
$db_password = "";
$database = "it_helpdesk";

$conn = new mysqli($host, $db_username, $db_password, $database);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}
$secret_key = "this_is_a_much_longer_secret_key_for_jwt_2026_it_helpdesk_project";
?>