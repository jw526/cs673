<?php
    include('./__init__.php');
    
    global $dbc;
    $portfolio_id = $_POST['portfolio_id'];
    $stock_market = $_POST['stock_market'];
    $ticker = $_POST['ticker'];
    $company_name = $_POST['company_name'];
    $quantity = $_POST['quantity'];
    $price = $_POST['price'];

    $sql = "
        INSERT INTO transactions (portfolio_id,
                                  user_id, 
                                  stock_market, 
                                  ticker, 
                                  company_name,
                                  quantity,
                                  price,
                                  transaction_action,
                                  transaction_timestamp)
            VALUES ('$portfolio_id',
                    '$_SESSION[user_id]',
                    '$stock_market',
                    '$ticker',
                    '$company_name',
                    '$quantity',
                    '$price',
                    '$transaction_action',
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
