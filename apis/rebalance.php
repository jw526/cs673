<?php
    include('./__init__.php');
    global $dbc;

    $function = $_POST['function'];
    $portfolio_id = $_POST['portfolio_id'];
    $us_stocks = $_POST['us_stocks'];
    $india_stocks = $_POST['india_stocks'];

    $domesticStockValue = $_POST['domesticStockValue'];
    $foreignStockValue = $_POST['foreignStockValue']; 
    $cash = $_POST['cash']; 
    $totalPortfolioValue = $domesticStockValue + $foreignStockValue + $cash;
    $tickerDomesticMostReturn = $_POST['usStockMostReturnTicker'];
    $tickerDomesticLeastReturn = $_POST['usStockLeastReturnTicker'];
    $tickerForeignMostReturn = $_POST['indiaStockMostReturnTicker'];
    $tickerForeignLeastReturn = $_POST['indiaStockLeastReturnTicker'];
    $domesticMostReturnPrice = (double) file_get_contents('https://web.njit.edu/~mc332/webapps8/hello2?ticket='.$tickerDomesticMostReturn); 
    $domesticLeastReturnPrice = (double) file_get_contents('https://web.njit.edu/~mc332/webapps8/hello2?ticket='.$tickerDomesticLeastReturn);
    $foreignMostReturnPrice = 0.014 * (double) file_get_contents('https://web.njit.edu/~mc332/webapps8/hello2?ticket='.$tickerForeignMostReturn);
    $foreignLeastReturnPrice = 0.014 * (double) file_get_contents('https://web.njit.edu/~mc332/webapps8/hello2?ticket='.$tickerForeignLeastReturn);
        

    function buy($portfolio_id, $stock_market, $ticker, $company_name, $quantity, $price){
        
        // Convert To JSON and send back
        $obj = (object) [
            'buy' => $ticker,
            'quantity' => $quantity
        ];
        echo json_encode($obj);
    }


    function sell ($portfolio_id, $stock_market, $ticker, $company_name, $quantity, $price){
        
        // Convert To JSON and send back
        $obj = (object) [
            'sell' => $ticker,
            'quantity' => $quantity
        ];
        echo json_encode($obj);
    }

    function needRebalance() {
        global $domesticStockValue, $foreignStockValue, $cash, $totalPortfolioValue;
        if ($domesticStockValue == 0 || $foreignStockValue == 0) {
            return false; 
        } 

        if (($cash > 0.1 * $totalPortfolioValue) || ($domesticStockValue/($domesticStockValue + $foreignStockValue) <> 0.7)){
            return true;
        }
        return false;
    }

    function rebalance (){
        global $portfolio_id, $domesticStockValue, $foreignStockValue, $cash, $totalPortfolioValue, $us_stocks, $india_stocks,
        $tickerDomesticMostReturn, $tickerDomesticLeastReturn, $tickerForeignLeastReturn, $tickerForeignMostReturn,
        $domesticLeastReturnPrice, $domesticMostReturnPrice, $foreignLeastReturnPrice, $foreignMostReturnPrice; 
        
        $obj = (object) [
            'buy' => [],
            'sell' => []
        ];

        $us = json_decode($us_stocks);
        $is = json_decode($india_stocks);   
        

        // if cash is greater than 10% of the total portfolio value, buy underweight asset (foreign/domestic)
     /*   if ($cash > 0.1 * $totalPortfolioValue){
            $buyAmt = $cash - 0.1 * $totalPortfolioValue;
            //domestic is overweight, buy foreign
            if($domesticStockValue/($domesticStockValue + $foreignStockValue) > 0.7){
                //buy the ticker from foreign stocks with the most return
                $sharesToBuy = $buyAmt / $foreignMostReturnPrice;

                array_push($obj->buy, (object) [
                    portfolio_id => $portfolio_id,
                    market => 'BSE/NSE',
                    qty => $sharesToBuy,
                    ticket => $tickerForeignMostReturn,
                    price => $foreignMostReturnPrice
                ]);  
            //domestic is underweight, buy domestic
            } else {
                //buy the ticker from domestic stocks with the most return
                $sharesToBuy = $buyAmt / $domesticMostReturnPrice;
    
                array_push($obj->buy, (object) [
                    portfolio_id => $portfolio_id,
                    market => 'Dow-30',
                    qty => $sharesToBuy,
                    ticket => $tickerDomesticMostReturn,
                    price => $domesticMostReturnPrice
                ]);  
                //buy ($portfolio_id, 'Dow-30', $tickerDomesticMostReturn, $tickerDomesticMostReturn, $sharesToBuy, $domesticMostReturnPrice);
            }
            $cash = 0.1 * $totalPortfolioValue;
    
        } */
        //domestic is underweight
        if($domesticStockValue/($domesticStockValue + $foreignStockValue) < 0.7){
            $domesticBuyAmt = 0.7 * $totalPortfolioValue - $domesticStockValue;
            //not enough cash to cover the buy amount
            if($domesticBuyAmt > $cash){
                $foreignSellAmt = $domesticBuyAmt - $cash;
                
                //sell foreign stocks
                foreach($is as $key => $value){
                    if($foreignSellAmt >= $value->price * $value->qty){
                        $foreignSellAmt = $foreignSellAmt - $value->price * $value->qty;
                        array_push($obj->sell, (object) [
                            portfolio_id => $portfolio_id,
                            market => 'BSE/NSE',
                            qty => $value->qty,
                            ticket => $key,
                            price => $value->price
                        ]);  
                        continue;
                    }
                    if($foreignSellAmt < $value->price * $value->qty) {
                        $qty = $foreignSellAmt / $value->price;
                        $foreignSellAmt = 0;
                        array_push($obj->sell, (object) [
                            portfolio_id => $portfolio_id,
                            market => 'BSE/NSE',
                            qty => $qty,
                            ticket => $key,
                            price => $value->price
                        ]);
                        break;  
                    }
                } 
            }
            //buy domestic with the most return since purchase
            $sharesToBuy = $domesticBuyAmt / $domesticMostReturnPrice;

            array_push($obj->buy, (object) [
                    portfolio_id => $portfolio_id,
                    market => 'Dow-30',
                    qty => $sharesToBuy,
                    ticket => $tickerDomesticMostReturn,
                    price => $domesticMostReturnPrice
            ]);      
        }
        //domestic is overweight
        else{
           // $foreignBuyAmt = (0.3 * $domesticStockValue - 0.7 * $foreignStockValue) / 0.7;
           $foreignBuyAmt = 0.3 * $totalPortfolioValue - $foreignStockValue;
            if ($foreignBuyAmt > $cash) {
                $domesticSellAmt = $foreignBuyAmt - $cash;
               // $sharesToSell = $domesticSellAmt / $domesticLeastReturnPrice;
                //sell domestic stocks
                foreach($us as $key => $value){
                    if($domesticSellAmt >= $value->price * $value->qty){
                        $domesticSellAmt = $domesticSellAmt - $value->price * $value->qty;
                        array_push($obj->sell, (object) [
                            portfolio_id => $portfolio_id,
                            market => 'Dow-30',
                            qty => $value->qty,
                            ticket => $key,
                            price => $value->price
                        ]); 
                        continue;
                    }
                    if($domesticSellAmt < $value->price * $value->qty) {
                        $qty = $domesticSellAmt / $value->price;
                        $domesticSellAmt = 0;
                        array_push($obj->sell, (object) [
                            portfolio_id => $portfolio_id,
                            market => 'Dow-30',
                            qty => $qty,
                            ticket => $key,
                            price => $value->price
                        ]);
                        break;  
                    }
                } 
            }
            //buy foreign with the most return since purchase
            $sharesToBuy = $foreignBuyAmt / $foreignMostReturnPrice;

            array_push($obj->buy, (object) [
                    portfolio_id => $portfolio_id,
                    market => 'BSE/NSE',
                    qty => $sharesToBuy,
                    ticket => $tickerForeignMostReturn,
                    price => $foreignMostReturnPrice
            ]); 

        }
            
        echo json_encode($obj);
    }

    if ($function == 'needRebalance') {
        $obj = (object) [
            'needRebalance' => needRebalance()
        ];
        echo json_encode($obj);
    }
    if ($function == 'rebalance') {
        rebalance();
    }

    //rebalance();

?>