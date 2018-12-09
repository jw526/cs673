
#install.packages("lpSolveAPI");
library(tseries);
library(jsonlite);
library(zoo);
library(lpSolveAPI);
args <- commandArgs(TRUE);
domesticStockValue = args[1];
foreignStockValue = args[2];
cash = args[3];
us_stocks = args[4];
india_stocks = args[5];
risk = args[6]

totalPortfolioValue = domesticStockValue + foreignStockValue + cash;

us = fromJSON(us_stocks);
is = fromJSON(india_stocks);

geo_return = function (x) {
    prod(diff(x)/lag(x, -1) +1) ^ (1/(length(x)-1))-1
}

get_er = function (ticker) {
    close = get.hist.quote(instrument = ticker, start = "2017-12-01", quote = "Close");
    #fill NA value backward
    close = na.locf(na.locf(close), fromLast = TRUE);
    geo_return (close);
}

get_beta = function (ticker) {
    dowclose = get.hist.quote(instrument = "^DJI", start = "2017-12-01", quote = "Close");
    dowdiff = diff(dowclose)/lag(dowclose, -1);
    niftyclose = get.hist.quote(instrument = "^NSEI", start = "2017-12-01", quote = "Close");
    niftydiff = diff(niftyclose)/lag(niftyclose, -1);
    niftydiff = na.fill(niftydiff, fill = 0);
    close = get.hist.quote(instrument = ticker, start = "2017-12-01", quote = "Close");
    diff = diff(close)/lag(close, -1);
    if (grepl(".", ticker, fixed=TRUE)){
        c = cbind (niftydiff, diff);
        c = na.fill(c, fill = 0);
        c = as.data.frame(c);
        cov(c[[1]], c[[2]])/ var (niftydiff);
    }
    else{
        c = cbind (dowdiff, diff);
        c = na.fill(c, fill = 0);
        c = as.data.frame(c);
        cov(c[[1]], c[[2]])/ var (dowdiff);
    }
}

#prep data for lpSolve
us_price = sapply(us, '[[', 2);
port = c(us, is);
price = sapply(port, '[[', 2);
qty = sapply(port,'[[', 3);
er = seq_along(port);
beta = seq_along(port);
for(i in 1:length(port)){
    er[i] = get_er(port[[i]]$ticker);
    beta[i] = get_beta(port[[i]]$ticker);
}

lprec = make.lp(5,length(port));
lp.control(lprec, sense="max");
set.objfn(lprec, obj = er);
set.row(lprec, 1, xt = price);
set.row(lprec, 2, xt = us_price, indices = seq_along(us_price));
set.row(lprec, 3, xt = price);
set.row(lprec, 4, xt = beta*price/totalPortfolioValue);
set.row(lprec, 5, xt = us_price, indices=seq_along(us_price));
set.type(lprec, 1:length(port), type = "integer");
set.constr.type(lprec, types = c(rep(">=",2), rep("<=",3)));
set.rhs(lprec, b = c(0.9*totalPortfolioValue,0.65*totalPortfolioValue,totalPortfolioValue,risk,0.75*totalPortfolioValue));
set.bounds(lprec, lower=c(rep(1, length(port))), columns = 1:length(port));

solve(lprec);
new_qty = get.variables(lprec);
qty_diff = new_qty - qty;
for (i in 1:length(qty_diff)){
    if (qty_diff[i] < 0) print(paste("sell", names(qty_diff)[i]), -qty_diff[i]);
    if (qty_diff[i] > 0) print(paste("buy", names(qty_diff)[i]), qty_diff[i]);
}
