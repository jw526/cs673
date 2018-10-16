function isFirstTimeBuyer(ticker) {
    var firstTime = true;
    var trans = window.App.datalayer.stockTransactions;

    for (var index = 0; index < trans.length; index++) {
        var tran = trans[index];
        if (patchTicker(tran.id) == patchTicker(ticker)) {
            firstTime = false;
        }
    }

    return firstTime;
}

function aggregateTransactions(stocks) {
    var stocksMap = {};

    for (var index = 0; index < stocks.length; index++) {
        var stock = stocks[index];

        if (!stocksMap[stock.id]) {
            stocksMap[stock.id] = {
                company_name: stock.company_name,
                stock_market: stock.stock_market
            }
        }

        if (!stocksMap[stock.id][stock.action]) {
            stocksMap[stock.id][stock.action] = [];
        }

        stocksMap[stock.id][stock.action].push(stock);
    }

    var keys = Object.keys(stocksMap);
    var aggregatedStocks = [];

    // Use map to create an array of stocks
    for (var index = 0; index < keys.length; index++) {
        var stockId = keys[index];

        var totalQtyBought = getTotalStockBoughtGivenTransactions(stocksMap, stockId);
        var totalQtySold = getTotalStockSoldGivenTransactions(stocksMap, stockId);

        var totalValueBought = getTotalStockBoughtValueGivenTransactions(stocksMap, stockId);
        var totalValueSold = getTotalStockSoldValueGivenTransactions(stocksMap, stockId);

        // only show stocks we own
        if (totalQtyBought - totalQtySold > 0) {
            aggregatedStocks.push({
                id: stockId,
                qty: totalQtyBought - totalQtySold,
                totalValue: totalValueBought - totalValueSold,
                company_name: stocksMap[stockId].company_name,
                stock_market: stocksMap[stockId].stock_market
            });
        }


    }

    // Fetch and Render Current Prices
    renderStockCurrentPrices(keys);

    return aggregatedStocks;
}

function getTotalStockBoughtValueGivenTransactions(stocksMap, stockId) {
    return getTotalStockValueGivenTransactions('buy', stocksMap, stockId);
}

function getTotalStockSoldValueGivenTransactions(stocksMap, stockId) {
    return getTotalStockValueGivenTransactions('sell', stocksMap, stockId);
}

function getTotalStockBoughtGivenTransactions(stocksMap, stockId) {
    return getTotalStockQtyGivenTransactions('buy', stocksMap, stockId);
}

function getTotalStockSoldGivenTransactions(stocksMap, stockId) {
    return getTotalStockQtyGivenTransactions('sell', stocksMap, stockId);
}

function getTotalStockValueGivenTransactions(type, stocksMap, stockId) {
    var value = 0;

    try {
        var stocksBought = stocksMap[stockId][type];

        if (!stocksBought) {
            return value;
        }

        for (var index = 0; index < stocksBought.length; index++) {
            var stock = stocksBought[index];
            value += parseFloat(stock.price * stock.qty);
        }

    } catch (error) {
        alert(error);
        console.log(error);
    }

    return value;
}

function getTotalStockQtyGivenTransactions(type, stocksMap, stockId) {
    var qty = 0;

    try {
        var stocksBought = stocksMap[stockId][type];

        if (!stocksBought) {
            return qty;
        }

        for (var index = 0; index < stocksBought.length; index++) {
            var stock = stocksBought[index];
            qty += parseFloat(stock.qty);
        }

    } catch (error) {
        alert(error);
        console.log(error);
    }

    return qty;
}

function patchTicker(ticker) {
    for (var index = 0; index < indiaStocks.length; index++) {
        var stock = indiaStocks[index];
        if (ticker.split('.')[0] == stock.split('.')[0].split('-')[0]) {
            return stock
        }
        if (ticker.split('.')[0] == stock.split('.')[0]) {
            return stock
        }
    }

    return ticker;
}

function isIndianStock(ticker) {
    var isIndian = false;

    for (var index = 0; index < indiaStocks.length; index++) {
        var stock = indiaStocks[index];
        if (ticker.split('.')[0] == stock.split('.')[0].split('-')[0]) {
            isIndian = true
        }
        if (ticker.split('.')[0] == stock.split('.')[0]) {
            isIndian = true
        }
    }

    return isIndian;
}

function getToalUsStocksValue() {
    var stocks = App.datalayer.currentStocksForCurrentView;
    var usStocksValue = 0;
    var stockPriceMap = App.datalayer.currentStockPrices

    for (var index = 0; index < stocks.length; index++) {
        var stock = stocks[index];
        var isIndian = isIndianStock(stock.id);

        if (!isIndian) {
            usStocksValue += (stock.qty * stockPriceMap[stock.id])
        }

    }

    return formatPrice(usStocksValue);
}

function getToalIndiaStocksValue() {
    var stocks = App.datalayer.currentStocksForCurrentView;
    var indiaStocksValue = 0;
    var stockPriceMap = App.datalayer.currentStockPrices

    for (var index = 0; index < stocks.length; index++) {
        var stock = stocks[index];
        var isIndian = isIndianStock(stock.id);

        if (isIndian) {
            indiaStocksValue += (stock.qty * stockPriceMap[stock.id])
        }

    }

    return formatPrice(indiaStocksValue);
}