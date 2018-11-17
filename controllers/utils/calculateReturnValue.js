
function calculateReturnValue(ticker, livePrice) {
    try {
        var userStocks = window.App.datalayer.currentStocksForCurrentView;
        var stock = null;

        for (var index = 0; index < userStocks.length; index++) {
            var _stock = userStocks[index];
            if (_stock.id == ticker) {
                stock = _stock;
                break
            }
        }

        if (!stock) {
            return;
        }


        var avgCost = stock.totalValue / stock.qty;;

        return livePrice - avgCost;
    } catch (error) {
        console.error(error);
    }
}

function getUsLRS() {
    try {
        var least = 99999999;
        var leastTicker = null;
        var returnMap = window.App.datalayer.currentStockReturnValue;
        var tickers = Object.keys(returnMap);

        for (var index = 0; index < tickers.length; index++) {
            var ticker = tickers[index];
            if (!isIndianStock(ticker)) {
                if (returnMap[ticker] < least) {
                    least = returnMap[ticker];
                    leastTicker = ticker;
                }
            }
        }

        return leastTicker;
    } catch (error) {
        console.error(error);

    }
}

function getUsMRS() {
    try {
        var least = -999999;
        var leastTicker = null;
        var returnMap = window.App.datalayer.currentStockReturnValue;
        var tickers = Object.keys(returnMap);

        for (var index = 0; index < tickers.length; index++) {
            var ticker = tickers[index];
            if (!isIndianStock(ticker)) {
                if (returnMap[ticker] > least) {
                    least = returnMap[ticker];
                    leastTicker = ticker;
                }
            }
        }

        return leastTicker;
    } catch (error) {
        console.error(error);
    }
}

function getInLRS() {
    try {
        var least = 99999999;
        var leastTicker = null;
        var returnMap = window.App.datalayer.currentStockReturnValue;
        var tickers = Object.keys(returnMap);

        for (var index = 0; index < tickers.length; index++) {
            var ticker = tickers[index];
            if (isIndianStock(ticker)) {
                if (returnMap[ticker] < least) {
                    least = returnMap[ticker];
                    leastTicker = ticker;
                }
            }
        }

        return leastTicker;
    } catch (error) {
        console.error(error);

    }
}

function getInMRS() {
    try {
        var least = -99999;
        var leastTicker = null;
        var returnMap = window.App.datalayer.currentStockReturnValue;
        var tickers = Object.keys(returnMap);

        for (var index = 0; index < tickers.length; index++) {
            var ticker = tickers[index];
            if (isIndianStock(ticker)) {
                if (returnMap[ticker] > least) {
                    least = returnMap[ticker];
                    leastTicker = ticker;
                }
            }
        }

        return leastTicker;
    } catch (error) {
        console.error(error);
    }
}