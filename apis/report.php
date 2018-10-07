<?php
    include('./__init__.php');
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=data.csv');
  
    
    $csvFile = fopen('php://output', 'w');

    // output the column headings
    fputcsv($csvFile, array('portfolio_name', 'portfolio_created', 'stock', 'stock_market', 'ticker', 'purchased_price', 'total_purchased_price', 'total_stock', 'last_transaction_date'));



$sql = "SELECT portfolio.portfolio_name AS portfolio_name,
        DATE_FORMAT(portfolio.created_timestamp, '%c-%d-%Y %H:%i:%S') AS portfolio_created,
               transactions.quantity AS stock,
               transactions.stock_market AS stock_market,
               transactions.ticker AS ticker,
               transactions.company_name AS company_name,
               transactions.price AS purchased_price,
           SUM((SELECT (stock * purchased_price))) AS total_purchased_price,
           SUM((SELECT stock)) AS total_stock,
           MAX(DATE_FORMAT(transactions.transaction_timestamp, '%c-%d-%Y %H:%i:%S')) AS last_transaction_date
          FROM portfolio
          JOIN transactions 
            ON portfolio.portfolio_id = transactions.portfolio_id 
           AND portfolio.user_id = transactions.user_id
         WHERE portfolio.user_id = $_SESSION[user_id]
           AND portfolio.open_close = 1
      GROUP BY transactions.ticker
      ORDER BY last_transaction_date ASC";  

$result = mysqli_query($dbc, $sql); 

$result_prints = array(); 

while (($row = mysqli_fetch_assoc($result)) != false) {

  fputcsv($csvFile, $row);
    // $result_prints[] = array(
    //     'portfolio_name'        => $row['portfolio_name'],
    //     'portfolio_created'     => $row['portfolio_created'],
    //     'stock_market'          => $row['stock_market'],
    //     'ticker'                => $row['ticker'],
    //     'company_name'          => $row['company_name'],
    //     'total_purchased_price' => $row['total_purchased_price'],
    //     'total_stock'           => $row['total_stock'],
    //     'last_transaction_date' => $row['last_transaction_date'],
    // );
}



// foreach ($result_prints as $result_print) {
//     echo 'Portfolio Name: ' .$result_print['portfolio_name'] . '<br>';
//     echo 'Portfolio Created On: ' .$result_print['portfolio_created'] . '<br>';
//     echo 'Stock Market: ' .$result_print['stock_market'] . '<br>';
//     echo 'Ticker: ' .$result_print['ticker'] . '<br>';
//     echo 'Company Name: ' .$result_print['company_name'] . '<br>';
//     echo 'Total Purchased Price: ' .$result_print['total_purchased_price'] . '<br>';
//     echo 'Total Stock: ' .$result_print['total_stock'] . '<br>';
//     echo 'Last Transaction Date: ' .$result_print['last_transaction_date'] . '<br><br><br><br><br>';
// }

?>




















