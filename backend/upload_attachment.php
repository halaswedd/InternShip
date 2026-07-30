<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

$ticket_id = $_POST['ticket_id'] ?? '';

if (empty($ticket_id)) {
    echo json_encode(["success" => false, "message" => "Ticket ID is required"]);
    exit;
}

$check = $conn->prepare("SELECT created_by, assigned_to FROM tickets WHERE id = ?");
$check->bind_param("i", $ticket_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Ticket not found"]);
    exit;
}

$ticket = $result->fetch_assoc();
$is_owner = $ticket['created_by'] == $user->user_id;
$is_assigned = $ticket['assigned_to'] == $user->user_id;
$is_staff = $user->role_id != 3;

if (!$is_owner && !$is_assigned && !$is_staff) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Not allowed to upload to this ticket"]);
    exit;
}

if (!isset($_FILES['file'])) {
    echo json_encode(["success" => false, "message" => "No file uploaded"]);
    exit;
}

$file = $_FILES['file'];

$max_size = 10 * 1024 * 1024;
if ($file['size'] > $max_size) {
    echo json_encode(["success" => false, "message" => "File is too large (max 10MB)"]);
    exit;
}

$allowed_types = ['image/jpeg', 'image/png', 'application/pdf'];
if (!in_array($file['type'], $allowed_types)) {
    echo json_encode(["success" => false, "message" => "File type not allowed (only PDF, PNG, JPG)"]);
    exit;
}


$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$safe_name = preg_replace('/[^A-Za-z0-9_\-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
$unique_name = $safe_name . '_' . time() . '.' . $ext;
$upload_path = __DIR__ . '/uploads/' . $unique_name;

if (move_uploaded_file($file['tmp_name'], $upload_path)) {
    $file_url = 'uploads/' . $unique_name;
    $stmt = $conn->prepare("INSERT INTO ticket_attachments (ticket_id, file_path, file_type) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $ticket_id, $file_url, $file['type']);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "File uploaded", "file_path" => $file_url]);
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Failed to save file"]);
}

$conn->close();
?>