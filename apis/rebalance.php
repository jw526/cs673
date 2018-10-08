<?php
    include('./__init__.php');
    global $dbc;

    $function = $_POST['function'];
    $$portfolio_id = $_POST['$portfolio_id'];
    $user_id = $_POST['user_id'];
    $tickerDomesticMostReturn = $_POST['tickerDomesticMostReturn'];
    $tickerDomesticLeastReturn = $_POST['tickerDomesticLeastReturn'];
    $tickerForeignMostReturn = $_POST['tickerForeignMostReturn'];
    $tickerForeignLeastReturn = $_POST['tickerForeignLeastReturn'];
    $domesticMostReturnPrice = $_POST['domesticMostReturnPrice'];
    $domesticLeastReturnPrice = $_POST['domesticLeastReturnPrice'];
    $foreignMostReturnPrice = $_POST['foreignMostReturnPrice'];
    $foreignLeastReturnPrice = $_POST['foreignLeastReturnPrice'];
    $domesticStockValue = $_POST['domesticStockValue'];
    $foreignStockValue = $_POST['foreignStockValue']; 
    $cash = $_POST['cash']; 
    $totalPortfolioValue = $domesticStockValue + $foreignStockValue + $cash;



    function buy($portfolio_id, $user_id, $stock_market, $ticker, $company_name, $quantity, $price){
        $sql = "
        INSERT INTO transactions (portfolio_id,
                                  user_id, 
                                  stock_market, 
                                  ticker, 
                                  company_name,
                                  quantity,
                                  price,
                                  transaction_action,
                                  transaction_timestamp)
            VALUES ('$portfolio_id',
                    '$user_id',
                    '$stock_market',
                    '$ticker',
                    '$company_name',
                    '$quantity',
                    '$price',
                    'buy',
                    NOW());
    ";

    $result = mysqli_query($dbc, $sql);

    // Convert To JSON and send back
    $obj = (object) [
        'success' => true
    ];
    echo json_encode($obj);

    /* Close Connection */
    mysqli_close($dbc);
    }

    function sell($portfolio_id, $user_id, $stock_market, $ticker, $company_name, $quantity, $price){
        $sql = "
        INSERT INTO transactions (portfolio_id,
                                  user_id, 
                                  stock_market, 
                                  ticker, 
                                  company_name,
                                  quantity,
                                  price,
                                  transaction_action,
                                  transaction_timestamp)
            VALUES ('$portfolio_id',
                    '$user_id',
                    '$stock_market',
                    '$ticker',
                    '$company_name',
                    '$quantity',
                    '$price',
                    'sell',
                    NOW());
    ";

    $result = mysqli_query($dbc, $sql);

    // Convert To JSON and send back
    $obj = (object) [
        'success' => true
    ];
    echo json_encode($obj);

    /* Close Connection */
    mysqli_close($dbc);
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

    function rebalance(){
        global $portfolio_id, $user_id, $domesticStockValue, $foreignStockValue, $cash, $totalPortfolioValue, 
        $tickerDomesticMostReturn, $tickerDomesticLeastReturn, $tickerForeignLeastReturn, $tickerForeignMostReturn,
        $domesticLeastReturnPrice, $domesticMostReturnPrice, $foreignLeastReturnPrice, $foreignMostReturnPrice; 
        // if cash is greater than 10% of the total portfolio value, buy underweight asset (foreign/domestic)
        if ($cash > 0.1 * $totalPortfolioValue){
            $buyAmt = $cash - 0.1 * $totalPortfolioValue;
            //domestic is overweight, buy foreign
            if($domesticStockValue/($domesticStockValue + $foreignStockValue) > 0.7){
                //buy the ticker from foreign stocks with the most return
                $sharesToBuy = $buyAmt / $foreignMostReturnPrice;
                buy ($portfolio_id, $user_id, 'BSE/NSE', $tickerForeignMostReturn, $tickerForeignMostReturn, $sharesToBuy, $foreignMostReturnPrice);
            //domestic is underweight, buy domestic
            } else {
                //buy the ticker from domestic stocks with the most return
                $sharesToBuy = $buyAmt / $domesticMostReturnPrice;
                buy ($portfolio_id, $user_id, 'Dow-30', $tickerDomesticMostReturn, $tickerDomesticMostReturn, $sharesToBuy, $domesticMostReturnPrice);
            }
    
        } 
        //domestic is underweight
        if($domesticStockValue/($domesticStockValue + $foreignStockValue) < 0.7){
            $domesticBuyAmt = 0.7 * ($domesticStockValue + $foreignStockValue) - $domesticStockValue;
            //not enough cash to cover the buy amount
            if($domesticBuyAmt < $cash){
                $foreignSellAmt = $domesticBuyAmt - $cash;
                $sharesToSell = $foreignSellAmt / $foreignLeastReturnPrice;
                //sell the stock from foreign stocks with the least return since purchase
                sell ($portfolio_id, $user_id, 'BSE/NSE', $tickerForeignLeastReturn, $tickerForeignLeastReturn, $sharesToSell, $foreignLeastReturnPrice);
            }
            //buy domestic with the most return since purchase
            $sharesToBuy = $domesticBuyAmt / $domesticMostReturnPrice;
            buy ($portfolio_id, $user_id, 'Dow-30', $tickerDomesticMostReturn, $tickerDomesticMostReturn, $sharesToBuy, $domesticMostReturnPrice);
    
        }
        //domestic is overweight
        else{
            $foreignBuyAmt = $domesticStockValue/0.7 - $domesticStockValue - $foreignStockValue;
            if ($foreignBuyAmt < $cash) {
                $domesticSellAmt = $foreignBuyAmt - $cash;
                $sharesToSell = $domesticSellAmt / $domesticLeastReturnPrice;
                //sell the stock from domestic stocks with the least return since purchase
                sell ($portfolio_id, $user_id, 'Dow-30', $tickerDomesticLeastReturn, $tickerDomesticLeastReturn, $sharesToSell, $domesticLeastReturnPrice);
            }
            //buy foreign with the most return since purchase
            $sharesToBuy = $foreignBuyAmt / $foreignMostReturnPrice;
            buy ($portfolio_id, $user_id, 'BSE/NSE', $tickerDomesticMostReturn, $tickerForeignMostReturn, $sharesToBuy, $foreignMostReturnPrice);
        }
            
    }

    if ($function == 'needRebalance') {
        $obj = (object) [
            'needRebalance' => needRebalance()
        ];
        echo json_encode($obj);
    }
    if ($function == 'rebalance') {
        echo rebalance();
    }

?>