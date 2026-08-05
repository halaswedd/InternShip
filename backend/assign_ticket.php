<?php
require_once "config.php";
require_once "auth_middleware.php";

$user = authenticate();

$data = json_decode(file_get_contents("php://input"), true);

$ticket_id = $data['ticket_id'] ?? '';
$agent_id = $data['agent_id'] ?? '';

if (empty($ticket_id) || empty($agent_id)) {
    echo json_encode(["success" => false, "message" => "Ticket ID and Agent ID are required"]);
    exit;
}

// Only Admin/Manager can assign tickets — adjust role_id check below
// if your Admin/Manager role isn't 1
if ($user->role_id != 1 && $user->role_id != 4) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Only Admin/Manager can assign tickets"]);
    exit;
}

// Make sure the ticket exists
$check = $conn->prepare("SELECT id FROM tickets WHERE id = ?");
$check->bind_param("i", $ticket_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Ticket not found"]);
    exit;
}

// Make sure the agent exists and is actually an agent (role_id = 2)
$agentCheck = $conn->prepare("SELECT id FROM users WHERE id = ? AND role_id = 2");
$agentCheck->bind_param("i", $agent_id);
$agentCheck->execute();
$agentResult = $agentCheck->get_result();

if ($agentResult->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Selected agent not found"]);
    exit;
}

$stmt = $conn->prepare("UPDATE tickets SET assigned_to = ? WHERE id = ?");
$stmt->bind_param("ii", $agent_id, $ticket_id);

if ($stmt->execute()) {
    log_activity($conn, $user->user_id, "Assigned ticket #$ticket_id to agent #$agent_id");
    create_notification($conn, $agent_id, "You have been assigned to ticket #$ticket_id");
    echo json_encode(["success" => true, "message" => "Ticket assigned successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to assign ticket"]);
}

$stmt->close();
$conn->close();
?>