<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

// بس Admin يقدر يغير أدوار
if ($user->role_id != 1) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Admin access only"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$target_user_id = $data['user_id'] ?? '';
$new_role_id = $data['role_id'] ?? '';

if (empty($target_user_id) || empty($new_role_id)) {
    echo json_encode(["success" => false, "message" => "User ID and role ID are required"]);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET role_id = ? WHERE id = ?");
$stmt->bind_param("ii", $new_role_id, $target_user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User role updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update role"]);
}

$stmt->close();
$conn->close();
?>