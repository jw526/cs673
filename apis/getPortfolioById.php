<?php
    include('./__init__.php');
    header('Content-Type: application/json');
    
    global $dbc;
    $portfolioId = $_POST['id'];

    $sql = "
        SELECT portfolio.portfolio_name AS portfolio_name,
            DATE_FORMAT(portfolio.created_timestamp, '%c-%d-%Y %H:%i:%S') AS portfolio_created,
            transactions.quantity AS total_stock,
            transactions.stock_market AS stock_market,
            transactions.ticker AS ticker,
            transactions.stock_market AS stock_market,
            transactions.company_name AS company_name,
            transactions.price AS price,
            transactions.transaction_action AS action,
            DATE_FORMAT(transactions.transaction_timestamp, '%c-%d-%Y %H:%i:%S') AS transaction_date
        FROM portfolio
        JOIN transactions 
            ON portfolio.portfolio_id = transactions.portfolio_id 
        AND portfolio.user_id = transactions.user_id
        WHERE portfolio.user_id = '$_SESSION[user_id]'
            AND portfolio.open_close = 1
            AND portfolio.portfolio_id = $portfolioId
        ORDER BY transaction_date ASC;
    ";

    $result = mysqli_query($dbc, $sql);

    // Convert To JSON and send back
    $portfoliosObj = (object) [
        'stocks' => [ ]
    ];

    while($row = mysqli_fetch_assoc($result)) {
      array_push($portfoliosObj->stocks, (object) [
            id => $row['ticker'],
            qty => $row['total_stock'],
            price => $row['price'],
            action => $row['action'],
            company_name => $row['company_name'],
            stock_market => $row['stock_market'],
            transaction_date => $row['transaction_date']
          ]);          
    } 

    echo json_encode($portfoliosObj);
    
    /* free result set */
    mysqli_free_result($result);

    /* Close Connection */
    mysqli_close($dbc);

?>
