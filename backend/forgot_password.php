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
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email is required"]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => true, "message" => "If that email exists, a password reset link has been sent."]);
    $stmt->close();
    exit;
}
$stmt->close();

$token = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));


$update = $conn->prepare("UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE email = ?");
$update->bind_param("sss", $token, $expires_at, $email);

if ($update->execute()) {
    $frontend_url = "http://localhost:3000"; 
    $reset_link = $frontend_url . "/reset-password?token=" . $token;

    
    $log_file = "reset_links_log.txt";
    $log_message = "[" . date('Y-m-d H:i:s') . "] Reset Link for $email: $reset_link" . PHP_EOL;
    
    file_put_contents($log_file, $log_message, FILE_APPEND);

    echo json_encode([
        "success" => true, 
        "message" => "Password reset link generated! (TEST MODE: Check the 'reset_links_log.txt' file in your backend folder or look at your database to get your token and test the link)."
    ]);

} else {
    echo json_encode(["success" => false, "message" => "Database error, please try again later."]);
}

$update->close();
$conn->close();
?>