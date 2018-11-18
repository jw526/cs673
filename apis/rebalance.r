
library(tseries);library(jsonlite)
args <- commandArgs(TRUE);
#portfolio_id = args[1];
#domesticStockValue = args[2];
#foreignStockValue = args[3];
#cash = args[4];
#us_stocks = args[5];
#india_stocks = args[6];
#tickerDomesticMostReturn = args[7];
#tickerForeignMostReturn = args[8];
#domesticMostReturnPrice = args[9];
#foreignMostReturnPrice = args[10];


# hard code for testing
portfolio_id = 333;
domesticStockValue = 3687.29;
foreignStockValue = 859.85;
cash = 1000;
tickerDomesticMostReturn = "ibb";
tickerForeignMostReturn = "GAIL.NS";
domesticMostReturnPrice = 55.5;
foreignMostReturnPrice = 11.11;
us_stocks = '{
        "aapl":{
          "ticker": "aapl",  
          "price": 333.3, 
          "qty": 3
        },
        "hd":{
          "ticker": "hd",  
          "price": 222.2,
          "qty": 2
        },
        "ibb": {
            "ticker": "ibb",
            "price":55.5,
            "qty": 5
        },

        "PLN": {
            "ticker": "PLN",
            "price": 666,
            "qty": 2
        },
        "AMZN": {
            "ticker": "AMZN",
            "price": 77.77,
            "qty": 7
        },
        "GE": {
            "ticker": "GE",
            "price": 9.9,
            "qty": 9
        }
    }'; 

    india_stocks = '{

        "GAIL.NS": {
            "ticker": "GAIL.NS",
            "price": 11.11,
            "qty": 1
        },

        "PAT.NS": {
            "ticker": "PAT.NS",
            "price": 22.22,
            "qty": 2
        },
        "TATA.NS": {
            "ticker": "TATA.NS",
            "price": 44.44,
            "qty": 4
        },

        "STV.NS": {
            "ticker": "STV.NS",
            "price": 8.88,
            "qty": 8
        }
    }';
us = fromJSON(us_stocks);
is = fromJSON(us_stocks);

rebalance <- function (domesticStockValue, foreignStockValue, cash, us_stocks, india_stocks, tickerDomesticMostReturn, tickerForeignMostReturn, domesticMostReturnPrice, foreignMostReturnPrice){
    totalPortfolioValue = domesticStockValue + foreignStockValue + cash; 
    #domestic is underweight
        if(domesticStockValue/(domesticStockValue + foreignStockValue) < 0.7){
            #buy domestic
            domesticBuyAmt = 0.7 * totalPortfolioValue - domesticStockValue;
            #not enough cash to cover the buy amount
            if(domesticBuyAmt > cash){
                foreignSellAmt = domesticBuyAmt - cash;
                
                #sell foreign stocks one by one
                for(i in india_stocks){
                    if(foreignSellAmt >= i$price * i$qty){
                        foreignSellAmt = foreignSellAmt - i$price * i$qty;
                        print(paste( "sell", i$ticker, "BSE/NSE", i$qty, i$price, sep = " ")); 
                        next;
                    }
                    if(foreignSellAmt < i$price * i$qty) {
                        qty = foreignSellAmt / i$price;
                        foreignSellAmt = 0;
                        print(paste( "sell", i$ticker, "BSE/NSE", qty, i$price, sep = " "));
                        break;  
                    }
                } 
            }
            #buy domestic with the most return since purchase
            sharesToBuy = domesticBuyAmt / domesticMostReturnPrice;
            print(paste( "buy", tickerDomesticMostReturn, "Dow-30", sharesToBuy,domesticMostReturnPrice, sep = " "));
                 
        }
        #domestic is overweight
        else{
           # buy foreign
           foreignBuyAmt = 0.3 * totalPortfolioValue - foreignStockValue;
            #not enough cash to cover the buy amount
            if (foreignBuyAmt > cash) {
                domesticSellAmt = foreignBuyAmt - cash;
                #sell domestic stocks one by one 
                for(u in us_stocks){
                    if(domesticSellAmt >= u$price * u$qty){
                        domesticSellAmt = domesticSellAmt - u$price * u$qty;
                        print(paste( "sell", u$ticker, "Dow-30", u$qty, u$price, sep = " "));
                        next;
                    }
                    if(domesticSellAmt < u$price * u$qty) {
                        qty = domesticSellAmt / u$price;
                        domesticSellAmt = 0;
                        print(paste( "sell", u$ticker, "Dow-30", qty, u$price, sep = " "));
                        break;  
                    }
                } 
            }
            #buy foreign with the most return since purchase
            sharesToBuy = foreignBuyAmt / foreignMostReturnPrice;
            print(paste( "buy", tickerForeignMostReturn, "BSE/NSE", sharesToBuy, foreignMostReturnPrice, sep = " "));
         
        }  

}


# if cash is greater than 10% of the total portfolio value, use extra to buy into 70/30
print(paste("portfolio_id: ", portfolio_id));
totalPortfolioValue = domesticStockValue + foreignStockValue + cash
if (cash > 0.1 * totalPortfolioValue){
    buyAmt = cash - 0.1 * totalPortfolioValue;
    usBuyAmt = 0.7 * buyAmt;
    indiaBuyAmt = 0.3 * buyAmt;
    print(paste( "buy", tickerDomesticMostReturn, "Dow-30", usBuyAmt/domesticMostReturnPrice, domesticMostReturnPrice, sep = " "));
    print(paste( "buy", tickerForeignMostReturn, "BSE/NSE", indiaBuyAmt/foreignMostReturnPrice, foreignMostReturnPrice, sep = " "));
    cash = 0.1 * totalPortfolioValue;
}
# apply the 70/30 rule to the non-cash value
rebalance(domesticStockValue, foreignStockValue, cash, us, is, tickerDomesticMostReturn, tickerForeignMostReturn, domesticMostReturnPrice, foreignMostReturnPrice);
