<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();
$role_id = $user->role_id;
$user_id = $user->user_id;
$is_employee = ($role_id == 3);

$sql = "
    SELECT s.name AS status, COUNT(t.id) AS count
    FROM statuses s
    LEFT JOIN tickets t ON t.status_id = s.id" .
    ($is_employee ? " AND t.created_by = ?" : "") . "
    GROUP BY s.id, s.name
";
$stmt = $conn->prepare($sql);
if ($is_employee) { $stmt->bind_param("i", $user_id); }
$stmt->execute();
$result = $stmt->get_result();
$status_counts = [];
while ($row = $result->fetch_assoc()) {
    $status_counts[$row['status']] = (int)$row['count'];
}


$sql2 = "
    SELECT c.name AS category, COUNT(t.id) AS count
    FROM categories c
    LEFT JOIN tickets t ON t.category_id = c.id" .
    ($is_employee ? " AND t.created_by = ?" : "") . "
    GROUP BY c.id, c.name
";
$stmt2 = $conn->prepare($sql2);
if ($is_employee) { $stmt2->bind_param("i", $user_id); }
$stmt2->execute();
$result2 = $stmt2->get_result();
$category_counts = [];
while ($row = $result2->fetch_assoc()) {
    $category_counts[$row['category']] = (int)$row['count'];
}


$sql3 = "
    SELECT p.name AS priority, COUNT(t.id) AS count
    FROM priorities p
    LEFT JOIN tickets t ON t.priority_id = p.id" .
    ($is_employee ? " AND t.created_by = ?" : "") . "
    GROUP BY p.id, p.name
";
$stmt3 = $conn->prepare($sql3);
if ($is_employee) { $stmt3->bind_param("i", $user_id); }
$stmt3->execute();
$result3 = $stmt3->get_result();
$priority_counts = [];
while ($row = $result3->fetch_assoc()) {
    $priority_counts[$row['priority']] = (int)$row['count'];
}


$sql4 = "
    SELECT t.id, t.reference_no, t.title, s.name AS status, p.name AS priority,
           u2.name AS agent_name
    FROM tickets t
    JOIN statuses s ON t.status_id = s.id
    JOIN priorities p ON t.priority_id = p.id
    LEFT JOIN users u2 ON t.assigned_to = u2.id" .
    ($is_employee ? " WHERE t.created_by = ?" : "") . "
    ORDER BY t.created_at DESC
    LIMIT 3
";
$stmt4 = $conn->prepare($sql4);
if ($is_employee) { $stmt4->bind_param("i", $user_id); }
$stmt4->execute();
$result4 = $stmt4->get_result();
$recent_tickets = [];
while ($row = $result4->fetch_assoc()) {
    $recent_tickets[] = $row;
}

echo json_encode([
    "success" => true,
    "by_status" => $status_counts,
    "by_category" => $category_counts,
    "by_priority" => $priority_counts,
    "recent_tickets" => $recent_tickets
]);

$stmt->close();
$stmt2->close();
$stmt3->close();
$stmt4->close();
$conn->close();
?>