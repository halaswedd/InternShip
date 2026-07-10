<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate(); // إذا الـ token غلط، بتوقف هون تلقائيا

$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$category_id = $data['category_id'] ?? '';
$priority_id = $data['priority_id'] ?? '';

if (empty($title) || empty($category_id) || empty($priority_id)) {
    echo json_encode(["success" => false, "message" => "Title, category and priority are required"]);
    exit;
}

// توليد رقم مرجعي فريد للتذكرة، مثلا: TKT-2026-0001
$reference_no = "TKT-" . date("Y") . "-" . strtoupper(substr(uniqid(), -6));

$status_id = 1; // 1 = Open افتراضيا (أول حالة بجدول statuses)
$created_by = $user->user_id; // جاي من الـ token مباشرة، مش من React!

$stmt = $conn->prepare("INSERT INTO tickets (reference_no, title, description, category_id, priority_id, status_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssiiii", $reference_no, $title, $description, $category_id, $priority_id, $status_id, $created_by);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Ticket created successfully",
        "reference_no" => $reference_no
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to create ticket"]);
}

$stmt->close();
$conn->close();
?>