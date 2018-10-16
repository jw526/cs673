<?php

ob_start();
session_start();


///-----------------------------------------------------------------
/// Connecting to the database
///-----------------------------------------------------------------
DEFINE ('DBUSER', 'root');
DEFINE ('DBPW', 'root');
DEFINE ('DBHOST', 'localhost');
DEFINE ('DBNAME', 'investments_management_system');

if ($dbc = mysqli_connect(DBHOST, DBUSER, DBPW, DBNAME))
{
    if (!$dbc)
    {
       echo "Could not select the database!<br />";
         exit();
    }
}
else
{
   echo "Could not connect to databese!<br />";
     exit();
}  

///-----------------------------------------------------------------
/// Reading database and writing to csv file
///-----------------------------------------------------------------
$sql = "SELECT portfolio.portfolio_name AS portfolio_name,
            DATE_FORMAT(portfolio.created_timestamp, '%c-%d-%Y %H:%i:%S') AS portfolio_created,
            transactions.transaction_id AS id,
            transactions.quantity AS total_stock,
            transactions.stock_market AS stock_market,
            transactions.ticker AS ticker,
            transactions.company_name AS company_name,
            transactions.price AS price,
            (SELECT total_stock * price) AS total_cost,
            transactions.transaction_action AS action,
            DATE_FORMAT(transactions.transaction_timestamp, '%c-%d-%Y %H:%i:%S') AS transaction_date,
            (SELECT SUM(sold) AS sold
                FROM transactions
                WHERE id = sold_from_transaction) AS total_sold,
            (SELECT total_stock - total_sold) AS remains
        FROM portfolio
        JOIN transactions 
        ON portfolio.portfolio_id = transactions.portfolio_id 
        AND portfolio.user_id = transactions.user_id
        WHERE portfolio.user_id = 1
        AND portfolio.open_close = 1
        AND transactions.transaction_action != 'sell'
        GROUP BY transactions.transaction_id
        ORDER BY transaction_date ASC";  

$result = mysqli_query($dbc, $sql); 

$result_stocks = array(); 

while (($row = mysqli_fetch_assoc($result)) != false) {
    $result_stocks[] = array(
        'portfolio_name'        => $row['portfolio_name'],
        'portfolio_created'     => $row['portfolio_created'],
        'total_stock'           => $row['total_stock'],
        'stock_market'          => $row['stock_market'],
        'ticker'                => $row['ticker'],
        'company_name'          => $row['company_name'],
        'purchased_price'       => $row['price'],
        'total_cost'            => $row['total_cost'],
        'transaction_date'      => $row['transaction_date'],
        'total_sold'            => $row['total_sold'],
        'remains'               => $row['remains'],
        );
}      


foreach ($result_stocks as $result_stock) {
	echo 'Portfolio Name: ' .$result_stock['portfolio_name']. '<br>';
	echo 'Portfolio created on: ' .$result_stock['portfolio_created']. '<br>';
	echo 'Total stock purchased: ' .$result_stock['total_stock']. '<br>';
	echo 'Stock market: ' .$result_stock['stock_market']. '<br>';
	echo 'Ticker: ' .$result_stock['ticker']. '<br>';
	echo 'Company name: ' .$result_stock['company_name']. '<br>';
	echo 'Purchased price: ' .$result_stock['purchased_price']. '<br>';
	echo 'Total purchased price: ' .$result_stock['total_cost']. '<br>';
	echo 'Transaction date: ' .$result_stock['transaction_date']. '<br>';

	if (!empty($result_stock['total_sold']) and !empty($result_stock['remains'])) {
	    echo 'Total stock sold: ' .$result_stock['total_sold']. '<br>';
	    echo 'Total stock remains: ' .$result_stock['remains'];
    }
	echo '<br><br><br>';
}






          
?>






















