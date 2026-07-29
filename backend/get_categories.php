<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

$result = $conn->query("SELECT id, name FROM categories ORDER BY name");
$categories = [];
while ($row = $result->fetch_assoc()) {
    $categories[] = $row;
}

echo json_encode(["success" => true, "categories" => $categories]);
$conn->close();
?>