<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();
$role_id = $user->role_id;
$user_id = $user->user_id;

$sql = "
    SELECT s.name AS status, COUNT(t.id) AS count
    FROM statuses s
    LEFT JOIN tickets t ON t.status_id = s.id" . 
    ($role_id == 3 ? " AND t.created_by = ?" : "") . "
    GROUP BY s.id, s.name
";

$stmt = $conn->prepare($sql);
if ($role_id == 3) {
    $stmt->bind_param("i", $user_id);
}
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
    ($role_id == 3 ? " AND t.created_by = ?" : "") . "
    GROUP BY c.id, c.name
";

$stmt2 = $conn->prepare($sql2);
if ($role_id == 3) {
    $stmt2->bind_param("i", $user_id);
}
$stmt2->execute();
$result2 = $stmt2->get_result();

$category_counts = [];
while ($row = $result2->fetch_assoc()) {
    $category_counts[$row['category']] = (int)$row['count'];
}

echo json_encode([
    "success" => true,
    "by_status" => $status_counts,
    "by_category" => $category_counts
]);

$stmt->close();
$stmt2->close();
$conn->close();
?>