
library(tseries);
library(jsonlite);
args <- commandArgs(TRUE);
domesticStockValue = args[1];
foreignStockValue = args[2];
cash = args[3];
us_stocks = args[4];
india_stocks = args[5];

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
    #c = na.locf(na.locf(c), fromLast = TRUE);
    c = na.fill(c, fill = 0);
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
