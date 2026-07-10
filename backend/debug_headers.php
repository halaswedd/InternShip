<?php
header("Content-Type: application/json");
echo json_encode([
    "getallheaders" => function_exists('getallheaders') ? getallheaders() : "not available",
    "SERVER_AUTH" => $_SERVER['HTTP_AUTHORIZATION'] ?? "not set",
    "SERVER_REDIRECT_AUTH" => $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? "not set"
]);
?>