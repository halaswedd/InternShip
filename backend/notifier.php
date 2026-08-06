<?php
function create_notification($conn, $user_id, $message) {
    $stmt = $conn->prepare("INSERT INTO notifications (user_id, message) VALUES (?, ?)");
    $stmt->bind_param("is", $user_id, $message);
    $stmt->execute();
    $stmt->close();
}
function notify_all_admins($conn, $message, $exclude_user_id = null) {
    if ($exclude_user_id) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE role_id = 1 AND id != ?");
        $stmt->bind_param("i", $exclude_user_id);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query("SELECT id FROM users WHERE role_id = 1");
    }
    while ($row = $result->fetch_assoc()) {
        create_notification($conn, $row['id'], $message);
    }
}
?> 