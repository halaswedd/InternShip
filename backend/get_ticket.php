<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

$ticket_id = $_GET['id'] ?? '';

if (empty($ticket_id)) {
    echo json_encode(["success" => false, "message" => "Ticket ID is required"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT t.id, t.reference_no, t.title, t.description, 
           t.category_id, t.priority_id, t.status_id,
           c.name AS category, p.name AS priority, s.name AS status,
           t.created_by, t.assigned_to, t.created_at
    FROM tickets t
    JOIN categories c ON t.category_id = c.id
    JOIN priorities p ON t.priority_id = p.id
    JOIN statuses s ON t.status_id = s.id
    WHERE t.id = ?
");
$stmt->bind_param("i", $ticket_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Ticket not found"]);
    exit;
}

$ticket = $result->fetch_assoc();

// نفس منطق الصلاحيات: بس صاحبها، المعين إلها، أو staff يقدر يشوفها
$is_owner = $ticket['created_by'] == $user->user_id;
$is_assigned = $ticket['assigned_to'] == $user->user_id;
$is_staff = $user->role_id != 3;

if (!$is_owner && !$is_assigned && !$is_staff) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "You are not allowed to view this ticket"]);
    exit;
}

echo json_encode(["success" => true, "ticket" => $ticket]);

$stmt->close();
$conn->close();
?>