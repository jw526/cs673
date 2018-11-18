<?php 
    
    $portfolio_id = $_POST['portfolio_id'];
    $domesticStockValue = $_POST['domesticStockValue'];
    $foreignStockValue = $_POST['foreignStockValue']; 
    $cash = $_POST['cash']; 
    $us_stocks = $_POST['us_stocks'];
    $india_stocks = $_POST['india_stocks'];
    $tickerDomesticMostReturn = $_POST['usStockMostReturnTicker'];
    $tickerForeignMostReturn = $_POST['indiaStockMostReturnTicker'];
    $domesticMostReturnPrice = (double) file_get_contents('https://web.njit.edu/~mc332/webapps8/hello2?ticket='.$tickerDomesticMostReturn); 
    $foreignMostReturnPrice = 0.014 * (double) file_get_contents('https://web.njit.edu/~mc332/webapps8/hello2?ticket='.$tickerForeignMostReturn);

    exec('Rscript rebalance.r', $output);
    for ($i=0; $i < count($output); $i++) { 
        echo $output[$i] . '~';
    }
?>