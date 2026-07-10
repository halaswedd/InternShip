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
?>