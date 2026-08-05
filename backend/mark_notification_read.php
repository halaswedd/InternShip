<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate();

$data = json_decode(file_get_contents("php://input"), true);
$notification_id = $data['notification_id'] ?? '';

if (empty($notification_id)) {
    echo json_encode(["success" => false, "message" => "Notification ID is required"]);
    exit;
}

$check = $conn->prepare("SELECT id FROM notifications WHERE id = ? AND user_id = ?");
$check->bind_param("ii", $notification_id, $user->user_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Notification not found"]);
    exit;
}

$stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
$stmt->bind_param("i", $notification_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Notification marked as read"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update notification"]);
}

$stmt->close();
$conn->close();
?>