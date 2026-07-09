<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "it_helpdesk";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully to the database!";
?>