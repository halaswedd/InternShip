<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

$data = json_decode(file_get_contents("php://input"), true);
$description = trim($data['description'] ?? '');

if (empty($description)) {
    echo json_encode(["success" => false, "message" => "Description is required"]);
    exit;
}

$priorities = ["Low", "Medium", "High", "Critical"];
$priorities_list = implode(", ", $priorities);

$prompt = "You are an IT helpdesk assistant. Based on this ticket description, choose the SINGLE most appropriate priority level from this exact list: $priorities_list. Critical means business-stopping issues (server down, no one can work). High means urgent but not full stop. Medium is normal. Low is minor/cosmetic. Reply with ONLY the priority word, nothing else.\n\nTicket description: \"$description\"";

$payload = json_encode([
    "contents" => [
        ["parts" => [["text" => $prompt]]]
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
$suggested = trim($result['candidates'][0]['content']['parts'][0]['text'] ?? '');

if (!in_array($suggested, $priorities)) {
    $suggested = "Medium";
}

echo json_encode(["success" => true, "suggested_priority" => $suggested]);

$conn->close();
?>