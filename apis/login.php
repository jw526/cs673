<?php
header('Content-Type: application/json');

$obj = (object) [
    'isUserRegistered' => true,
    'ads' => $_POST['email']
];

echo json_encode($obj);
?>