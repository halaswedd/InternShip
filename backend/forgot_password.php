<?php
// Enable error reporting and CORS
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

// 1. Check if the user exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Security Best Practice: Don't reveal if an email doesn't exist
    echo json_encode(["success" => true, "message" => "If that email exists, a password reset link has been sent."]);
    $stmt->close();
    exit;
}
$stmt->close();

// 2. Generate a secure 1-hour token
$token = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

// 3. Save token in the database
$update = $conn->prepare("UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE email = ?");
$update->bind_param("sss", $token, $expires_at, $email);

if ($update->execute()) {
    // 4. React Frontend URL
    $frontend_url = "http://localhost:3000"; // Your React app URL
    $reset_link = $frontend_url . "/reset-password?token=" . $token;

    // --- TEMPORARY TESTING BYPASS ---
    // Instead of letting local mail() crash your script on port 25, we log the link to a file.
    // This allows you to test the entire React page flow without a configured SMTP server.
    
    $log_file = "reset_links_log.txt";
    $log_message = "[" . date('Y-m-d H:i:s') . "] Reset Link for $email: $reset_link" . PHP_EOL;
    
    file_put_contents($log_file, $log_message, FILE_APPEND);

    // Return success to React
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