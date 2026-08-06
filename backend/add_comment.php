<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate();

$data = json_decode(file_get_contents("php://input"), true);

$ticket_id = $data['ticket_id'] ?? '';
$comment = trim($data['comment'] ?? '');

if (empty($ticket_id) || empty($comment)) {
    echo json_encode(["success" => false, "message" => "Ticket ID and comment are required"]);
    exit;
}

// Make sure the ticket exists
$check = $conn->prepare("SELECT id FROM tickets WHERE id = ?");
$check->bind_param("i", $ticket_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Ticket not found"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $ticket_id, $user->user_id, $comment);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Comment added"]);
$ticketInfo = $conn->prepare("SELECT created_by, assigned_to, reference_no FROM tickets WHERE id = ?");
$ticketInfo->bind_param("i", $ticket_id);
$ticketInfo->execute();
$ticketRow = $ticketInfo->get_result()->fetch_assoc();
$ticketInfo->close();

$ref = $ticketRow['reference_no'];

if ($ticketRow['created_by'] != $user->user_id) {
    create_notification($conn, $ticketRow['created_by'], "New comment on ticket $ref", $ticket_id);
}
if (!empty($ticketRow['assigned_to']) && $ticketRow['assigned_to'] != $user->user_id && $ticketRow['assigned_to'] != $ticketRow['created_by']) {
    create_notification($conn, $ticketRow['assigned_to'], "New comment on ticket $ref", $ticket_id);
}
notify_all_admins($conn, "New comment on ticket $ref", $user->user_id, $ticket_id);
} else {
    echo json_encode(["success" => false, "message" => "Failed to add comment"]);
}

$stmt->close();
$conn->close();
?>