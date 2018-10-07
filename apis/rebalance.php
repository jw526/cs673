<?php
    include('./__init__.php');
    global $dbc;
    $portfolio_id = $_POST['portfolio_id'];
    $cash = $_POST['cash'];
    $domesticStockValue = $_POST['domesticStockValue'];
    $foreignStockValue = $_POST['foreignStockValue'];

    $function = $_POST['function'];

    /* $sql = "select ? from $portfolio_id";  //get the total portfolio value
    $totalPortfolioValue = mysqli_query($dbc, $sql);

    $sql = "select ? from $portfolio_id"; //get the domestic stock value
    $domesticStockValue = mysqli_query($dbc, $sql);;

    $sql = "Select ? from $portfolio_id"; //get the foreign portfolio value
    $foreignStockValue = mysqli_query($dbc, $sql);

    $sql = "Select ? from $portfolio_id"; //get the available cash
    $cash = mysqli_query($dbc, $sql); */

    function needRebalance($cash, $domesticStockValue, $foreignStockValue) {

        if ($domesticStockValue == 0 || $foreignStockValue == 0) {
            return 'FALSE';
        }

        if (($cash > 0.1 * $totalPortfolioValue) or ($domesticStockValue/($domesticStockValue + $foreignStockValue) > 0.7)){
            return 'TRUE';
        }
        return 'FALSE';
    }

    function rebalance($cash, $domesticStockValue, $foreignStockValue){
        // if cash is greater than 10% of the total portfolio value, buy underweight asset (foreign/domestic)
        if ($cash > 0.1 * $totalPortfolioValue){
            $buyAmt = $cash - 0.1 * $totalPortfolioValue;
            //domestic is overweight, buy foreign
            if($domesticStockValue/($domesticStockValue + $foreignStockValue) > 0.7){
                $sql = "select the stock from foreign stocks with the most return since purchase"; //return a ticker
            //domestic is underweight, buy domestic
            } else {
                $sql = "select the stock from domestic stocks with the most return since purchase";
            }
    
            $stockToBuy = $conn->query($sql);
            //Call getPrice from servlet with ($stockToBuy, $date), get current price $price
            $sharesToBuy = $buyAmt / $price;
            // Call buy function with $stockToBuy and $sharesToBuy
        } else {
            //domestic is underweight
            if($domesticStockValue/($domesticStockValue + $foreignStockValue) < 0.7){
                $domesticBuyAmt = 0.7 * ($domesticStockValue + $foreignStockValue) - $domesticStockValue;
                //not enough cash to cover the buy amount
                if($domesticBuyAmt < $cash){
                    $foreignSellAmt = $domesticBuyAmt - $cash;
                    //sell the foreign to cover the difference
                    $sql = "select the stock from foreign stocks with the least return since purchase";
                    $stockToSell = $conn->query($sql);
                    //Call getPrice from servlet with ($stockToSell, $date), get current price $price
                    $sharesToSell = $foreignSellAmt / $price;
                    // Call sell function with $stockToSell and $sharesToSell
                }
                //buy domestic
                $sql = "select the stock from domestic stocks with the most return since purchase";
                $stockToBuy = $conn -> query(sql);
                //Call getPrice from servlet with ($stockToBuy, $date), get current price $price
                $sharesToBuy = $domesticBuyAmt / $price;
                // Call buy function with $stockToBuy and $sharesToBuy
            
            }
            //domestic is overweight
            if($domesticStockValue/($domesticStockValue + $foreignStockValue) > 0.7){
                $foreignBuyAmt = $domesticStockValue/0.7 - $domesticStockValue - $foreignStockValue;
                if ($foreignBuyAmt < $cash) {
                    $domesticSellAmt = $foreignBuyAmt - $cash;
                    $sql = "select the stock from domestic stocks with the least return";
                    $stockToSell = $conn->query(sql);
                    //Call getPrice from servlet with ($stockToSell, $date), get current price $price
                    $sharesToSell = $domesticSellAmt / $price;
                    // Call sell function with $stockToSell and $sharesToSell
                }
                //buy foreign
                $sql = "select the stock from foreign stocks with the most return";
                $stockToBuy = $conn -> query(sql);
                //Call getPrice from servlet with ($stockToBuy, $date), get current price $price
                $sharesToBuy = $foreignBuyAmt / $price;
                // Call buy function with $stockToBuy and $sharesToBuy
            }
        }    
    }
  
    
    if ($function == 'needRebalance') {
        $obj = (object) [
            'needRebalance' => needRebalance($cash, $domesticStockValue, $foreignStockValue)
        ];
        echo json_encode($obj);
    }

    if ($function == 'rebalance') {
        echo rebalance($cash, $domesticStockValue, $foreignStockValue);
    }


    // usStockLeastReturnTicker,
    // usStockMostReturnTicker,
    // indiaStockLeastReturnTicker,
    // indiaStockMostReturnTicker
?>