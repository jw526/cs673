<?php 
    
    $function = $_POST['function'];
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



    $obj = (object) [
        'buy' => [],
        'sell' => []
    ];


    function exec_r (){
        global $obj, $portfolio_id, $domesticStockValue, $foreignStockValue, $cash, $us_stocks, $india_stocks,
        $tickerDomesticMostReturn, $tickerForeignMostReturn, $domesticMostReturnPrice, $foreignMostReturnPrice;
        //r for rebalance
        exec('Rscript rebalance.r $portfolio_id $domesticStockValue $foreignStockValue $cash $us_stocks $india_stocks $tickerDomesticMostReturn $tickerForeignMostReturn $domesticMostReturnPrice $foreignMostReturnPrice', $output);
        //r for portfolio beta calculation
        exec('Rscript port_beta.r $domesticStockValue $foreignStockValue $cash $us_stocks $india_stocks', $beta);

        //for testing
        // $output = array("portfolio_id:  333",
        // "buy ibb Dow-30 5.61621981981982 55.5",
        // "buy GAIL.NS BSE/NSE 12.0239243924392 11.11",
        // "sell aapl Dow-30 0.348011401140114 333.3",
        // "buy GAIL.NS BSE/NSE 60.3695949594959 11.11");

        for ($i=1; $i < count($output); $i++) { 
            $order = explode ( " " , $output[$i] );
            if ($order[0] == "buy"){
                array_push($obj->buy, (object) [
                    ticket => $order[1],
                    qty => $order[3]
                ]);  
            } else{
                array_push($obj->sell, (object) [
                    ticket => $order[1],
                    qty => $order[3]
                ]);  
            }
        }

        echo json_encode($obj);

        // reset Object
        $obj = (object) [
            'buy' => [],
            'sell' => []
        ];

    }

    if ($function == 'exec_r') {
        exec_r();
    }

    //for testing
    //exec_r();

?>