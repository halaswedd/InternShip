<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

if ($user->role_id != 1) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Admin access only"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$target_id = $data['user_id'] ?? '';

if (empty($target_id)) {
    echo json_encode(["success" => false, "message" => "User ID is required"]);
    exit;
}

if ($target_id == $user->user_id) {
    echo json_encode(["success" => false, "message" => "You cannot delete your own account"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $target_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete user (they may have existing tickets)"]);
}

$stmt->close();
$conn->close();
?>