<?php
require 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require 'config.php';

function authenticate() {
    global $secret_key;
   $headers = getallheaders();
$auth_header = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';

    if (empty($auth_header) || !str_starts_with($auth_header, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "No token provided"]);
        exit;
    }

    $token = substr($auth_header, 7); // بيشيل كلمة "Bearer " ويخلي بس الـ token
    

    try {
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        return $decoded; // فيه user_id و role_id
    } catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid or expired token"]);
    exit;
}
}
?>