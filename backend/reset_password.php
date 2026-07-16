<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

require_once "config.php";

$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';
$new_password = $data['password'] ?? '';

if (empty($token) || empty($new_password)) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}


$stmt = $conn->prepare("SELECT id, reset_token_expires_at FROM users WHERE reset_token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid or expired link token."]);
    $stmt->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

$current_time = date('Y-m-d H:i:s');
if ($user['reset_token_expires_at'] < $current_time) {
    echo json_encode(["success" => false, "message" => "This link has expired. Please request a new one."]);
    exit;
}

$hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
$update = $conn->prepare("UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?");
$update->bind_param("si", $hashed_password, $user['id']);

if ($update->execute()) {
    echo json_encode(["success" => true, "message" => "Password updated successfully! You can now log in."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update password. Please try again."]);
}

$update->close();
$conn->close();
?>