<?php
  include('./__init__.php');

  // Following function excepts ticker, file path (were history files are stored), total amount invested 
  // and total amounted invested in each stock.


  // Important 
  // We need to get stock history from yahoo.com and store it in the folder and specify path.
  // Important 

  function calculate_each_stock_return($filename, $ticker, $sum, $result_predictions) {

      $row = 1;

      // Holds all Close dollar column values 
      $array_price = array();


      // Array holds difference in price between current day and prior day
      $array_diff = array();


      // Array step one, adding 1 to each array element in prior array
      $step_one = array();


      // Array step two, product of all array items from prior array
      $step_two = array();


      // Reading csv file getting close date column only values
      if (($open = fopen($filename, "r")) !== FALSE) {

          while (($data = fgetcsv($open, 1000, ",")) !== FALSE) {

              $array_price[] = $data[4];
          }

          fclose($open);
      }


      // Calculating difference between first and next day close values
      for($i = 1; $i <= count($array_price); $i++) {

        $new_price = $array_price[$i+1] / $array_price[$i] - 1;
      
          $array_diff[] = $new_price;
      }


      // Removing last two elements from array which is 1 and N/A
      $array_diff = array_splice($array_diff, 0, -2);


      // Adding one to each item from prior array
      for ($j = 0; $j <= count($array_diff); $j++) {
        $step_one[] = $array_diff[$j] + 1;
      }

      
      // Calculating product from each value in prior array
      $product_of_array = array_product($step_one) . "\n";


      // Calculatining rate 
      $rate = (pow($product_of_array, 1 / count($array_diff)))-1;


      // Calculating new stock price
      $final_stock_price = $array_price[count($array_diff)+1] * (1 + $rate); 


      // Rate of return
      $portfolio_return = $final_stock_price - $array_price[count($array_diff)+1];


      // Calculating increase between new predicted stock value and last sell stock value
      $stock_increas = ($final_stock_price - $array_price[count($array_diff)+1]) / $array_price[count($array_diff)+1];


      // Calculating weight 
      $increase_on_portfolio = ($result_predictions / $sum) * $stock_increas;


      // Returning weight, ticker, predicted final stock price and rate of return
      return $increase_on_portfolio. ' Ticker: ' .$ticker. '<br> Predicted price stock: $' .$final_stock_price. ' <br> Return rate: ' .$portfolio_return. '<br><br>';  
  }
  // END FUNCTION



  // Do not modify going forwared unless noted otherwise
  $stock_results = array();
  $tatal_portfolio = 0;
  $sum = 0;


  // This is main running file
  // Only what is required is to pull history of stock and place it in the file/folder. 
  // This function will do the rest


  // Following query will check if stock still exist in the user portfolio or not
  // and will return ticker and stock total purchesed value.
  // This query required to check if user still have a stock or not
  // and will pass tickers and dollars sums of stock to the function ....

  // Selecting all stock tickers and suming the amounts 
  $query = "SELECT DISTINCT transactions.ticker as ticker,
              SUM((SELECT (transactions.quantity * transactions.price))) AS total_balance
            FROM transactions
            JOIN portfolio 
              ON transactions.portfolio_id = portfolio.portfolio_id
            WHERE portfolio.portfolio_id = 87
              AND portfolio.user_id = 4
        GROUP BY transactions.ticker
          HAVING total_balance > 0";

  $result_query = mysqli_query($dbc, $query); 

  $result_predictions = array(); 

  while (($row = mysqli_fetch_assoc($result_query)) != false) {
      $result_predictions[] = array(
          'ticker'         => $row['ticker'],
          'total_balance'  => $row['total_balance'],
      );
  }

  // Total amount invested, adding all stock amounts
  foreach ($result_predictions as $result_prediction) {

    $sum = $result_prediction['total_balance'] + $sum;
  }


  // For each ticker running function
  foreach ($result_predictions as $result_prediction) {
    
    // IMPORTENT IMPORTENT IMPORTENT IMPORTENT IMPORTENT
    // You can specify different path to the CSV file here 
      // Path to csv file or files 
      $filename = 'stock_history/' .$result_prediction['ticker']. '.csv';


      // If file exists, reading the file, otherwise showing error message
      if (file_exists($filename)) {
          
          // File found runing function coded above. 
          $results = calculate_each_stock_return($filename, $result_prediction['ticker'], $sum, $result_prediction['total_balance']);

          $stock_results = explode(' ', $results);           

      } else {

        // File not found showing an error.
          echo "The file $filename does not exist";
      }  


      // Showing stock ticker, predicted price and return rate
      for ($h = 1; $h <= count($stock_results); $h++) {
          echo $stock_results[$h]. ' '; 
      }  

      $total_portfolio = $total_portfolio + $stock_results[0];
  
  }

  // Calculating entire portfolio return
  $total_portfolio_return = $sum * $total_portfolio; 

  // Showing entire portfolio return   
  echo 'Total portfolio return: $' .$total_portfolio_return;


?>
