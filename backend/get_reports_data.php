<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

if ($user->role_id == 3) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access restricted"]);
    exit;
}

// إحصائيات عامة
$total = $conn->query("SELECT COUNT(*) AS c FROM tickets")->fetch_assoc()['c'];
$open = $conn->query("SELECT COUNT(*) AS c FROM tickets t JOIN statuses s ON t.status_id = s.id WHERE s.name = 'Open'")->fetch_assoc()['c'];
$resolved = $conn->query("SELECT COUNT(*) AS c FROM tickets t JOIN statuses s ON t.status_id = s.id WHERE s.name IN ('Resolved','Closed')")->fetch_assoc()['c'];

// متوسط وقت الحل بالساعات (بين created_at و updated_at، بس للتذاكر المحلولة)
$avgResult = $conn->query("
    SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) AS avg_hours
    FROM tickets t JOIN statuses s ON t.status_id = s.id
    WHERE s.name IN ('Resolved','Closed')
");
$avg_hours = $avgResult->fetch_assoc()['avg_hours'];

// تذاكر شهريا (آخر 6 أشهر)
$monthly = [];
$monthlyResult = $conn->query("
    SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym, DATE_FORMAT(created_at, '%b') AS label, COUNT(*) AS count
    FROM tickets
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY ym, label
    ORDER BY ym ASC
");
while ($row = $monthlyResult->fetch_assoc()) {
    $monthly[] = ["label" => $row['label'], "count" => (int)$row['count']];
}

// أفضل الموظفين (IT Agents) حسب عدد التذاكر المحلولة
$topResult = $conn->query("
    SELECT u.id, u.name, COUNT(t.id) AS resolved_count
    FROM users u
    JOIN tickets t ON t.assigned_to = u.id
    JOIN statuses s ON t.status_id = s.id
    WHERE u.role_id = 2 AND s.name IN ('Resolved','Closed')
    GROUP BY u.id, u.name
    ORDER BY resolved_count DESC
    LIMIT 5
");
$top_performers = [];
while ($row = $topResult->fetch_assoc()) {
    $top_performers[] = $row;
}

// آخر نشاط دعم (آخر 6 تذاكر معدلة)
$recentResult = $conn->query("
    SELECT t.reference_no, t.title, s.name AS status, u.name AS agent_name, t.updated_at
    FROM tickets t
    JOIN statuses s ON t.status_id = s.id
    LEFT JOIN users u ON t.assigned_to = u.id
    ORDER BY t.updated_at DESC
    LIMIT 6
");
$recent_activity = [];
while ($row = $recentResult->fetch_assoc()) {
    $recent_activity[] = $row;
}

echo json_encode([
    "success" => true,
    "total_tickets" => (int)$total,
    "open_tickets" => (int)$open,
    "resolved_tickets" => (int)$resolved,
    "avg_resolution_hours" => $avg_hours ? round($avg_hours, 1) : 0,
    "monthly" => $monthly,
    "top_performers" => $top_performers,
    "recent_activity" => $recent_activity
]);

$conn->close();
?>