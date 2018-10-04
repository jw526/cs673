<?php
    include('./__init__.php');
    
    global $dbc;
    $cashAmount = $_POST['cashAmount'];
    $portfolioId = $_POST['portfolioId'];

    $sql = "
        INSERT INTO cash (user_id,
                          portfolio_id,
                          cash_amount,
                          cash_action,
                          cash_timestamp)
            VALUES ('$_SESSION[user_id]',
                    '$portfolioId',
                    '$cashAmount',
                    'invested',
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
