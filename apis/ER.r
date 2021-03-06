
library(tseries);
library(jsonlite);
library(zoo);

args <- commandArgs(TRUE);
us_stocks = args[1];
india_stocks = args[2];

# hard code for testing
# us_stocks = '{
#         "aapl":{
#           "ticker": "AAPL",  
#           "price": 333.3, 
#           "qty": 3
#         },
#         "hd":{
#           "ticker": "HD",  
#           "price": 222.2,
#           "qty": 2
#         },
#         "ibb": {
#             "ticker": "IBB",
#             "price":55.5,
#             "qty": 5
#         },

#         "GS": {
#             "ticker": "GS",
#             "price": 666,
#             "qty": 2
#         },
#         "AMZN": {
#             "ticker": "AMZN",
#             "price": 77.77,
#             "qty": 7
#         },
#         "GE": {
#             "ticker": "GE",
#             "price": 9.9,
#             "qty": 9
#         }
#     }'; 

#     india_stocks = '{

#         "GAIL.NS": {
#             "ticker": "GAIL.NS",
#             "price": 11.11,
#             "qty": 1
#         },

#         "SBIN.NS": {
#             "ticker": "SBIN.NS",
#             "price": 22.22,
#             "qty": 2
#         },
#         "TCS.NS": {
#             "ticker": "TCS.NS",
#             "price": 44.44,
#             "qty": 4
#         },

#         "ITC.NS": {
#             "ticker": "ITC.NS",
#             "price": 8.88,
#             "qty": 8
#         }
#     }';
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

# combine list
port = c(us, is);

for(i in 1:length(port)){
    er[i] = get_er(port[[i]]$ticker);
    print(paste( port[[i]]$ticker, er, sep = " ")); 
}

