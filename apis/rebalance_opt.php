<?php 
    
    $function = $_POST['function'];
    $portfolio_id = $_POST['portfolio_id'];
    $domesticStockValue = $_POST['domesticStockValue'];
    $foreignStockValue = $_POST['foreignStockValue']; 
    $cash = $_POST['cash']; 
    $us_stocks = $_POST['us_stocks'];
    $india_stocks = $_POST['india_stocks'];
    $risk = $_POST['risk'];


    $obj = (object) [
        'buy' => [],
        'sell' => []
    ];


    function exec_r (){
        global $obj, $portfolio_id, $domesticStockValue, $foreignStockValue, $cash, $us_stocks, $india_stocks, $risk;
        //r for optimized rebalance
        exec('Rscript optimizer.r $domesticStockValue $foreignStockValue $cash $us_stocks $india_stocks $risk', $output);

       //for testing
        // $output = array(
        // "buy ibb 5",
        // "buy GAIL.NS 1",
        // "sell aapl 3",
        // "buy GAIL.NS 1");

        for ($i=0; $i < count($output); $i++) { 
            $order = explode ( " " , $output[$i] );
            if ($order[0] == "buy"){
                array_push($obj->buy, (object) [
                    ticket => $order[1],
                    qty => $order[2]
                ]);  
            } else{
                array_push($obj->sell, (object) [
                    ticket => $order[1],
                    qty => $order[2]
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