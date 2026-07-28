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
} else {
    echo json_encode(["success" => false, "message" => "Failed to add comment"]);
}

$stmt->close();
$conn->close();
?>