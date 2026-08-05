<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate();

$data = json_decode(file_get_contents("php://input"), true);

$ticket_id = $data['ticket_id'] ?? '';
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$category_id = $data['category_id'] ?? '';
$priority_id = $data['priority_id'] ?? '';
$status_id = $data['status_id'] ?? '';

if (empty($ticket_id)) {
    echo json_encode(["success" => false, "message" => "Ticket ID is required"]);
    exit;
}


$check = $conn->prepare("SELECT created_by, assigned_to, status_id FROM tickets WHERE id = ?");
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
    echo json_encode(["success" => false, "message" => "You are not allowed to edit this ticket"]);
    exit;
}

$stmt = $conn->prepare("UPDATE tickets SET title = ?, description = ?, category_id = ?, priority_id = ?, status_id = ? WHERE id = ?");
$stmt->bind_param("ssiiii", $title, $description, $category_id, $priority_id, $status_id, $ticket_id);

if ($stmt->execute()) {
    log_activity($conn, $user->user_id, "Updated ticket #$ticket_id");
    if ($ticket['status_id'] != $status_id && $ticket['created_by'] != $user->user_id) {
    create_notification($conn, $ticket['created_by'], "Ticket #$ticket_id status changed");
}
    echo json_encode(["success" => true, "message" => "Ticket updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update ticket"]);
}

$stmt->close();
$conn->close();
?>