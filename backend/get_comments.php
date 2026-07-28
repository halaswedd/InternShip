<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate();

$ticket_id = $_GET['ticket_id'] ?? '';

if (empty($ticket_id)) {
    echo json_encode(["success" => false, "message" => "Ticket ID is required"]);
    exit;
}

$stmt = $conn->prepare(
    "SELECT tc.id, tc.comment, tc.created_at, u.name AS commenter_name
     FROM ticket_comments tc
     JOIN users u ON tc.user_id = u.id
     WHERE tc.ticket_id = ?
     ORDER BY tc.created_at ASC"
);
$stmt->bind_param("i", $ticket_id);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
while ($row = $result->fetch_assoc()) {
    $comments[] = $row;
}

echo json_encode(["success" => true, "comments" => $comments]);

$stmt->close();
$conn->close();
?>
