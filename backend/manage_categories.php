<?php
require 'config.php';
require 'auth_middleware.php';

$user = authenticate();

if ($user->role_id != 1) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Admin access only"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

if ($action === 'add') {
    $name = trim($data['name'] ?? '');
    if (empty($name)) {
        echo json_encode(["success" => false, "message" => "Category name is required"]);
        exit;
    }
    $stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
    $stmt->bind_param("s", $name);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Category added"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to add category (maybe it already exists)"]);
    }
    $stmt->close();
} elseif ($action === 'delete') {
    $id = $data['id'] ?? '';
    if (empty($id)) {
        echo json_encode(["success" => false, "message" => "Category ID is required"]);
        exit;
    }
    // تأكيد إنو ما في تذاكر مرتبطة بهاي الفئة قبل الحذف
    $check = $conn->prepare("SELECT COUNT(*) AS cnt FROM tickets WHERE category_id = ?");
    $check->bind_param("i", $id);
    $check->execute();
    $count = $check->get_result()->fetch_assoc()['cnt'];
    if ($count > 0) {
        echo json_encode(["success" => false, "message" => "Cannot delete: category is used by $count ticket(s)"]);
        exit;
    }
    $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Category deleted"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete category"]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
}

$conn->close();
?>