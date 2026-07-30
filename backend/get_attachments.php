<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();
$ticket_id = $_GET['ticket_id'] ?? '';

if (empty($ticket_id)) {
    echo json_encode(["success" => false, "message" => "Ticket ID is required"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, file_path, file_type, uploaded_at FROM ticket_attachments WHERE ticket_id = ? ORDER BY uploaded_at DESC");
$stmt->bind_param("i", $ticket_id);
$stmt->execute();
$result = $stmt->get_result();

$attachments = [];
while ($row = $result->fetch_assoc()) {
    $attachments[] = $row;
}

echo json_encode(["success" => true, "attachments" => $attachments]);
$stmt->close();
$conn->close();
?>