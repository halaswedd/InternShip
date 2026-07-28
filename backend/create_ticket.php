<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate(); 

$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$category_id = $data['category_id'] ?? '';
$priority_id = $data['priority_id'] ?? '';

if (empty($title) || empty($category_id) || empty($priority_id)) {
    echo json_encode(["success" => false, "message" => "Title, category and priority are required"]);
    exit;
}


$reference_no = "TKT-" . date("Y") . "-" . strtoupper(substr(uniqid(), -6));

$status_id = 1;
$created_by = $user->user_id; 

$stmt = $conn->prepare("INSERT INTO tickets (reference_no, title, description, category_id, priority_id, status_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssiiii", $reference_no, $title, $description, $category_id, $priority_id, $status_id, $created_by);

if ($stmt->execute()) {
    log_activity($conn, $created_by, "Created ticket $reference_no");
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