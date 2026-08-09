<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

$data = json_decode(file_get_contents("php://input"), true);
$current_password = $data['current_password'] ?? '';
$new_password = $data['new_password'] ?? '';

if (empty($current_password) || empty($new_password)) {
    echo json_encode(["success" => false, "message" => "Current and new password are required"]);
    exit;
}

if (strlen($new_password) < 5) {
    echo json_encode(["success" => false, "message" => "New password must be at least 5 characters"]);
    exit;
}

$stmt = $conn->prepare("SELECT password_hash FROM users WHERE id = ?");
$stmt->bind_param("i", $user->user_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!password_verify($current_password, $row['password_hash'])) {
    echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
    exit;
}

$new_hashed = password_hash($new_password, PASSWORD_BCRYPT);

$update = $conn->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
$update->bind_param("si", $new_hashed, $user->user_id);

if ($update->execute()) {
    echo json_encode(["success" => true, "message" => "Password changed successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to change password"]);
}

$stmt->close();
$update->close();
$conn->close();
?>