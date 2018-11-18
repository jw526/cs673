
library(tseries);
library(jsonlite);
args <- commandArgs(TRUE);
#domesticStockValue = args[1];
#foreignStockValue = args[2];
#cash = args[3];
#us_stocks = args[4];
#india_stocks = args[5];

# hard code for testing
domesticStockValue = 3687.29;
foreignStockValue = 859.85;
cash = 100;
totalPortfolioValue = domesticStockValue + foreignStockValue + cash;
us_stocks = '{
        "aapl":{
          "ticker": "AAPL",  
          "price": 333.3, 
          "qty": 3
        },
        "hd":{
          "ticker": "HD",  
          "price": 222.2,
          "qty": 2
        },
        "ibb": {
            "ticker": "IBB",
            "price":55.5,
            "qty": 5
        },

        "GS": {
            "ticker": "GS",
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

        "SBIN.NS": {
            "ticker": "SBIN.NS",
            "price": 22.22,
            "qty": 2
        },
        "TCS.NS": {
            "ticker": "TCS.NS",
            "price": 44.44,
            "qty": 4
        },

        "ITC.NS": {
            "ticker": "ITC.NS",
            "price": 8.88,
            "qty": 8
        }
    }';
us = fromJSON(us_stocks);
is = fromJSON(india_stocks);

dowopen <-get.hist.quote(instrument = "^DJI", start = "2017-01-01", quote = "Open")

dowclose <-get.hist.quote(instrument = "^DJI", start = "2017-01-01", quote = "Close")


dowdiff = (dowclose - dowopen)/dowopen

niftyopen <-get.hist.quote(instrument = "^NSEI", start = "2017-01-01", quote = "Open")

niftyclose <-get.hist.quote(instrument = "^NSEI", start = "2017-01-01", quote = "Close")

#fill NA value backward

library(zoo)
niftyopen = na.locf(na.locf(niftyopen), fromLast = TRUE)
niftyclose = na.locf(na.locf(niftyclose), fromLast = TRUE)

niftydiff = (niftyclose - niftyopen)/niftyopen

usbeta = 0;
for(u in us){
    open = get.hist.quote(instrument = u$ticker, start = "2017-01-01", quote = "Open");
    close = get.hist.quote(instrument = u$ticker, start = "2017-01-01", quote = "Close");
    diff = (close - open)/ open;
    beta = cov(diff, dowdiff)/ var (dowdiff);
    weight = u$price * u$qty / totalPortfolioValue;
    usbeta = usbeta + beta * weight;
}

indiabeta = 0;
for(i in is){
    open = get.hist.quote(instrument = i$ticker, start = "2017-01-01", quote = "Open");
    close = get.hist.quote(instrument = i$ticker, start = "2017-01-01", quote = "Close");
    diff = (close - open)/ open;
    c = cbind (niftydiff, diff);
    c = na.locf(na.locf(c), fromLast = TRUE);
    c = as.data.frame(c);
    beta = cov(c[[1]], c[[2]])/ var (niftydiff);
    weight = i$price * i$qty / totalPortfolioValue;
    indiabeta = indiabeta + beta * weight;
}

portbeta = usbeta + indiabeta

colnames(portbeta)[colnames(portbeta)=="Close"] <- "portfolio"; rownames(portbeta)[rownames(portbeta)=="Close"] <- "beta";
portbeta;

# data cleaning testing

#a = get.hist.quote(instrument = "GAIL.NS", start = "2018-11-02", quote = "Close")
#b = get.hist.quote(instrument = "^NSEI", start = "2018-11-02", quote = "Close")
#b = na.locf(na.locf(b), fromLast = TRUE)
#c = cbind (a, b)
#cov (a, b)
#c = na.locf(na.locf(c), fromLast = TRUE)
#c = as.data.frame(c)
#c[[2]]
#cov(c[[1]],c[[2]])
