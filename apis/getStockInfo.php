<?php
    include('./__init__.php');
    
    // Convert To JSON and send back
    $obj = (object) [
        'price' => rand(10,100)
    ];
    echo json_encode($obj);
    
?>
