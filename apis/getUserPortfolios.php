<?php
    include('./__init__.php');
    header('Content-Type: application/json');
    
    global $dbc;

    $sql = "
        SELECT portfolio_name, portfolio_id, 
              DATE_FORMAT(created_timestamp, '%c-%d-%Y %H:%i:%S')
          FROM portfolio
        WHERE user_id = '$_SESSION[user_id]'
          AND open_close = 1
        ORDER BY portfolio_name ASC;
    ";

    $result = mysqli_query($dbc, $sql);


    // Convert To JSON and send back
    $portfoliosObj = (object) [
        'portfolios' => [ ]
    ];

    while($row = mysqli_fetch_assoc($result)) {
      array_push($portfoliosObj->portfolios, (object) [
            id => $row['portfolio_id'],
            name => $row['portfolio_name'],
            cash => '0%',
            stock => '0%',
            total => '$0'
          ]);          
    } 



    echo json_encode($portfoliosObj);
    
    /* free result set */
    mysqli_free_result($result);

    /* Close Connection */
    mysqli_close($dbc);

?>
