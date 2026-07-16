<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate();

$data = json_decode(file_get_contents("php://input"), true);
$ticket_id = $data['ticket_id'] ?? '';

if (empty($ticket_id)) {
    echo json_encode(["success" => false, "message" => "Ticket ID is required"]);
    exit;
}

$check = $conn->prepare("SELECT created_by FROM tickets WHERE id = ?");
$check->bind_param("i", $ticket_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Ticket not found"]);
    exit;
}

$ticket = $result->fetch_assoc();


$is_owner = $ticket['created_by'] == $user->user_id;
$is_staff = $user->role_id != 3;

if (!$is_owner && !$is_staff) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "You are not allowed to delete this ticket"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM tickets WHERE id = ?");
$stmt->bind_param("i", $ticket_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Ticket deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete ticket"]);
}

$stmt->close();
$conn->close();
?>