<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate();

// Only Admin/Manager can view activity logs
if ($user->role_id != 1 && $user->role_id != 4) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Not authorized"]);
    exit;
}

$stmt = $conn->prepare(
    "SELECT al.id, al.action, al.created_at, u.name AS user_name
     FROM activity_logs al
     JOIN users u ON al.user_id = u.id
     ORDER BY al.created_at DESC
     LIMIT 100"
);
$stmt->execute();
$result = $stmt->get_result();

$logs = [];
while ($row = $result->fetch_assoc()) {
    $logs[] = $row;
}

echo json_encode(["success" => true, "logs" => $logs]);

$stmt->close();
$conn->close();
?>