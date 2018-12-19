<?php

$function = $_POST['function'];
$us_stocks = $_POST['us_stocks'];
$india_stocks = $_POST['india_stocks'];


    global $us_stocks, $india_stocks;

    exec("Rscript ER.r $us_stocks $india_stocks", $output);

    echo "Stock Expected Return(Daily):", PHP_EOL;

    for ($i=0; $i < count($output); $i++) {
        // $line = explode ( " " , $output[$i] );
        echo $output[$i], PHP_EOL;
    }


?>