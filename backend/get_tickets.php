<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate();

$user_id = $user->user_id;
$role_id = $user->role_id;

// إذا Employee (role_id = 3)، بيشوف بس تذاكره هو
// أي دور تاني (Admin, IT Agent, Manager)، بيشوف كل التذاكر
if ($role_id == 3) {
    $stmt = $conn->prepare("
        SELECT t.id, t.reference_no, t.title, t.description, 
               c.name AS category, p.name AS priority, s.name AS status,
               t.created_at, t.assigned_to
        FROM tickets t
        JOIN categories c ON t.category_id = c.id
        JOIN priorities p ON t.priority_id = p.id
        JOIN statuses s ON t.status_id = s.id
        WHERE t.created_by = ?
        ORDER BY t.created_at DESC
    ");
    $stmt->bind_param("i", $user_id);
} else {
    $stmt = $conn->prepare("
        SELECT t.id, t.reference_no, t.title, t.description, 
               c.name AS category, p.name AS priority, s.name AS status,
               t.created_at, t.assigned_to
        FROM tickets t
        JOIN categories c ON t.category_id = c.id
        JOIN priorities p ON t.priority_id = p.id
        JOIN statuses s ON t.status_id = s.id
        ORDER BY t.created_at DESC
    ");
}

$stmt->execute();
$result = $stmt->get_result();

$tickets = [];
while ($row = $result->fetch_assoc()) {
    $tickets[] = $row;
}

echo json_encode(["success" => true, "tickets" => $tickets]);

$stmt->close();
$conn->close();
?>