<?php
    include('./__init__.php');
    header('Content-Type: application/json');
    
    global $dbc;
    $portfolio_id = $_POST['portfolioId'];

    $sql = "
        UPDATE portfolio 
        SET open_close = 0,
            closed_timestamp = NOW()
      WHERE portfolio_id = '$portfolio_id'
        AND user_id = '$_SESSION[user_id]';
    ";

    $result = mysqli_query($dbc, $sql);

    // Convert To JSON and send back
    $obj = (object) [
        'success' => true
    ];
    echo json_encode($obj);

    /* Close Connection */
    mysqli_close($dbc);  
?>