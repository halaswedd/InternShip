<?php
require_once "config.php";
require_once "auth_middleware.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role_id = $data['role_id'] ?? 3; 

if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered"]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users (role_id, name, email, password_hash) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $role_id, $name, $email, $hashed_password);

if ($stmt->execute()) {
    notify_all_admins($conn, "New user registered: $name");
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed"]);
}

$stmt->close();
$conn->close();
?>