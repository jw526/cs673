<?php
header('Content-Type: application/json');

$obj = (object) [
    'aString' => 'some string',
    'anArray' => [ 1, 2, 3 ]
];

echo json_encode($obj);
?>