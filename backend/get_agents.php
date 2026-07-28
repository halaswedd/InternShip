<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate();

$stmt = $conn->prepare("SELECT id, name FROM users WHERE role_id = 2");
$stmt->execute();
$result = $stmt->get_result();

$agents = [];
while ($row = $result->fetch_assoc()) {
    $agents[] = $row;
}

echo json_encode(["success" => true, "agents" => $agents]);

$stmt->close();
$conn->close();
?>