<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

// بس Admin (role_id = 1) مسموحلو يشوف هالصفحة
if ($user->role_id != 1) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Admin access only"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT u.id, u.name, u.email, u.created_at, u.role_id, r.name AS role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    ORDER BY u.created_at DESC
");
$stmt->execute();
$result = $stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode(["success" => true, "users" => $users]);

$stmt->close();
$conn->close();
?>