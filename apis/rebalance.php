<?php
$server = "localhost";
$user = "user";
$pwd = "pwd";
$database = "db";
//connect to database
$conn = new mysqli($server, $user, $pwd, $database) or die("Connection failed: ". $conn->connect_error);
$sql = (Select xxx from $portfolioName); //get the total portfolio value
$totalPortfolioValue = $conn->query($sql);

$sql = (Select xxx from $portfolioName); //get the domestic stock value
$domesticStockValue = $conn->query($sql);

$sql = (Select xxx from $portfolioName); //get the foreign portfolio value
$foreignStockValue = $conn->query($sql);

$sql = (Select xxx from $portfolioName); //get the available cash
$cash = $conn->query(sql);

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
