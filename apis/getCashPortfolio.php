<?php
  include('./__init__.php');    
  global $dbc;
  $portfolioId = $_POST['portfolioId'];


  $sql = "
      SELECT SUM(cash_amount) AS total_cash,
            cash_action,
            DATE_FORMAT(cash_timestamp, '%c-%d-%Y %H:%i:%S')
        FROM cash
      WHERE user_id = '$_SESSION[user_id]'
        AND portfolio_id = '$portfolioId' 
      ORDER BY cash_timestamp ASC;   
  ";

  $result = mysqli_query($dbc, $sql);


  // Convert To JSON and send back
  $portfoliosObj = (object) [
      'totalCash' => 0
  ];

  while($row = mysqli_fetch_assoc($result)) {
    $portfoliosObj->totalCash = $row['total_cash'];        
  } 



  echo json_encode($portfoliosObj);
  
  /* free result set */
  mysqli_free_result($result);

  /* Close Connection */
  mysqli_close($dbc);

?>
