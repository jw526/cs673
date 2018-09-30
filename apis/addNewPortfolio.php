<?php
    include('./__init__.php');
    
    global $dbc;
    $portfolioName = $_POST['portfolioName'];

    $sql = "
            INSERT INTO portfolio (user_id, 
                                  portfolio_name, 
                                  open_close, 
                                  created_timestamp)
                VALUES ('$_SESSION[user_id]',
                        '$portfolioName',
                        1,
                        NOW());
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
