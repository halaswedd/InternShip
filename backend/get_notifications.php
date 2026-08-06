<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate();

$stmt = $conn->prepare("SELECT id, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50");
$stmt->bind_param("i", $user->user_id);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

echo json_encode(["success" => true, "notifications" => $notifications]);

$stmt->close(); 
$conn->close();
?>