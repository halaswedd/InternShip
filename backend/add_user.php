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

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role_id = $data['role_id'] ?? 3;

if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Name, email and password are required"]);
    exit;
}

$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users (role_id, name, email, password_hash) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $role_id, $name, $email, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User created successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to create user"]);
}

$stmt->close();
$conn->close();
?>