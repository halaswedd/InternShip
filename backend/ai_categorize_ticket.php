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

$categories = ["Hardware", "Software", "Network", "Email", "Access Request", "Other"];
$categories_list = implode(", ", $categories);

$prompt = "You are an IT helpdesk assistant. Based on this ticket description, choose the SINGLE most appropriate category from this exact list: $categories_list. Reply with ONLY the category name, nothing else.\n\nTicket description: \"$description\"";

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

// نتأكد إنو الرد فعلا واحدة من الفئات المعروفة (حماية من رد غريب)
if (!in_array($suggested, $categories)) {
    $suggested = "Other";
}

echo json_encode(["success" => true, "suggested_category" => $suggested]);

$conn->close();
?>