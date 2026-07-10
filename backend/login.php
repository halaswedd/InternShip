<?php
require 'vendor/autoload.php';
use Firebase\JWT\JWT;

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$db_username = "root";
$db_password = "";
$database = "it_helpdesk";

$conn = new mysqli($host, $db_username, $db_password, $database);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, name, email, password_hash, role_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password_hash'])) {
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    exit;
}

$secret_key = "this_is_a_much_longer_secret_key_for_jwt_2026_it_helpdesk_project";
$issued_at = time();
$expiration_time = $issued_at + 3600; // صالح لمدة ساعة

$payload = [
    "iat" => $issued_at,
    "exp" => $expiration_time,
    "user_id" => $user['id'],
    "role_id" => $user['role_id']
];

$jwt = JWT::encode($payload, $secret_key, 'HS256');

echo json_encode([
    "success" => true,
    "message" => "Login successful",
    "token" => $jwt,
    "user" => [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "role_id" => $user['role_id']
    ]
]);
$stmt->close();
$conn->close();
?>