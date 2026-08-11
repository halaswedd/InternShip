<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

$data = json_decode(file_get_contents("php://input"), true);
$message = trim($data['message'] ?? '');

if (empty($message)) {
    echo json_encode(["success" => false, "message" => "Message is required"]);
    exit;
}


$system_instruction = "You are a helpful IT helpdesk assistant for a company. Employees ask you technical questions before opening a support ticket. Give short, practical, step-by-step help (max 4-5 sentences). If the issue seems complex or needs an IT agent's direct action (like account access, hardware replacement), tell them to create a support ticket instead.";

$payload = json_encode([
    "system_instruction" => ["parts" => [["text" => $system_instruction]]],
    "contents" => [
        ["parts" => [["text" => $message]]]
    ]
]);

$ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=$gemini_api_key");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$reply = trim($result['candidates'][0]['content']['parts'][0]['text'] ?? "Sorry, I couldn't process that. Please try again or create a ticket.");

echo json_encode(["success" => true, "reply" => $reply]);

$conn->close();
?>