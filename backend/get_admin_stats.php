<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

if ($user->role_id != 1) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Admin access only"]);
    exit;
}

$result = $conn->query("SELECT COUNT(*) AS total FROM users");
$total_users = $result->fetch_assoc()['total'];

$result2 = $conn->query("SELECT COUNT(*) AS total FROM tickets WHERE status_id = 1");
$open_tickets = $result2->fetch_assoc()['total'];

$result3 = $conn->query("SELECT COUNT(*) AS total FROM users WHERE role_id = 2");
$support_agents = $result3->fetch_assoc()['total'];

echo json_encode([
    "success" => true,
    "total_users" => (int)$total_users,
    "open_tickets" => (int)$open_tickets,
    "support_agents" => (int)$support_agents
]);

$conn->close();
?>