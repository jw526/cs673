/**
 * @author Michael Citro
 */

window.App = window.App || {};

// This will init all user controllers
(function (App) {
  var minStocks = 7;
  var macStocks = 10;
  var dowThreshold = 0.70;
  var indiaThreshold = 0.30;
  var cashThreshold = 0.10


  // This will expose the user controller
  App.Stocks = {
    buyStock: _buyStock,
    sellStock: _sellStock,
    toggleSellStockModal: _toggleSellStockModal,
    getStockInfo: _getStockInfo,
    aggregate: _aggregate
  }


  function _buyStock() {
    var datalayer = window.App.datalayer;
    var porfolioId = window.getCurrentPortfolioId();
    var qty = $("#stock-buy-qty").val();

    var totalCost = qty * datalayer.searchStockData.price;

    if (totalCost > datalayer.currentPortfolioCash) {
      return alert('Please add more cash!');
    }

    $.ajax(window.App.endpoints.buyStock, {
      method: 'post',
      success: function (data) {
        $('#view-stock-modal').modal('toggle');
        $("#stock-modal-title").html('');
        $("#search-stock-price").html('');
        
        
        window.App.Portfolio.loadPortfolioById();
        window.App.Portfolio.investCashPortfolio(totalCost);
      },
      data: {
        portfolio_id: porfolioId,
        stock_market: window.App.datalayer.searchStockData.stock_market,
        ticker: window.App.datalayer.searchStockData.ticker,
        company_name: window.App.datalayer.searchStockData.company_name,
        quantity: qty,
        price: window.App.datalayer.searchStockData.price
      }
    });
  }

  function _sellStock () {
    var stocksInPortfolio = window.App.datalayer.currentStocksForCurrentView;
    var selectedStockId = window.App.datalayer.selectedStockId
    var amountToSell = $('#amount-of-stock-to-sell').val();

    var myStock = {};
    var currentPrice = formatPrice(window.App.datalayer.currentStockPrices[selectedStockId]);
    
    for (var index = 0; index < stocksInPortfolio.length; index++) {
      var stock = stocksInPortfolio[index];
      if (patchTicker(stock.id) == selectedStockId) {
        myStock = stock;
      }
    }

    if (myStock.qty < amountToSell) {
      console.log('You only have ' + myStock.qty)
      return alert('You only have ' + myStock.qty)
    }

    //  if (isIndianStock(myStock.id)) {
    //     currentPrice = currentPrice * indiaConverionRate;
    //  }
    

    var datalayer = window.App.datalayer;
    var porfolioId = window.getCurrentPortfolioId();
    var totalValue = amountToSell * currentPrice;


    
    $.ajax(window.App.endpoints.sellStock, {
      method: 'post',
      success: function (data) {
        $('#sell-stock-modal').modal('toggle');
        window.App.Portfolio.loadPortfolioById();
        window.App.Portfolio.addCashPortfolio(totalValue, true);
      },
      data: {
        portfolio_id: porfolioId,
        stock_market: myStock.stock_market,
        ticker: myStock.id,
        company_name: myStock.company_name,
        quantity: amountToSell,
        price: currentPrice
      }
    });
  }

  function _toggleSellStockModal(element) {
    var selectedStockId = $($(element).parent().parent().children('.id')[0]).html()

    window.App.datalayer.selectedStockId = selectedStockId;

    
    $('#stock-name-to-sell').html("How Much " + selectedStockId + " to sell?");
    $('#sell-stock-modal').modal('toggle');
  }

  function _getStockInfo(event) {
    event.preventDefault();
    var stock = event.target['search-input-feild'].value;

    // If stock is not supported return and alert
    if ((dow30.concat(indiaStocks)).indexOf(stock) === -1) {
      alert('Sorry Stock Not Found');
      return;
    }

  

    // Store selected data for latter use
    var isDow30 = dow30.indexOf(stock) > -1;
    window.App.datalayer.searchStockData = {
      stock_market: isDow30 ? 'Dow-30' : 'BSE/NSE',
      ticker: stock.split(":")[0],
      company_name: !isDow30 ? stock : stock.split(":")[1]
    }

    var ticker = patchTicker(window.App.datalayer.searchStockData.ticker);

    _getStockPrice(ticker, function (price) {
      if (isFirstTimeBuyer(ticker)) {
        price = window.septemberPriceMap[ticker] || 0
      }

      // Display Info
      $("#stock-modal-title").html(stock);
      $('#view-stock-modal').modal();
      $("#search-stock-price").html(price);

      if (!isDow30) {
        $("#search-stock-price").html(
          formatPrice(price * window.indiaConverionRate) + " (" + price + "INR)"
          );
        price = price * window.indiaConverionRate;
      }

      window.App.datalayer.searchStockData.price = price;
    });


  }


  function _aggregate(stocks) {
    var stocksMap = {};

    /*
      Create Map
      {
        ticketId: {
          buy: [],
          sell: [],
          invest: [],
          company_name
          stock_market
        }
      }
    */
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
})(window.App)


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

// Only for portfolio view
function renderStockCurrentPrices (arrayOfTickers) {
  for (var index = 0; index < arrayOfTickers.length; index++) {
    var ticker = arrayOfTickers[index];

    render(ticker)

  }

  function render(ticker) {
    //console.log(ticker);
    _getStockPrice(ticker, function (price) {
      var isIndia = isIndianStock(ticker);
      var truePrice = price;

      if (isIndia) {
        truePrice = formatPrice(price * window.indiaConverionRate);
      }
      
      $("#stock-ticker-" + ticker.replace(/\.|&/, "_")).html(truePrice && truePrice.toFixed(2));
      window.App.datalayer.currentStockPrices[ticker] = truePrice;
      window.App.datalayer.currentStockPrices[patchTicker(ticker)] = truePrice;
      window.App.datalayer.currentStockReturnValue[ticker] = calculateReturnValue(ticker, truePrice);
    });
  }
}

function patchTicker (ticker) {
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


function _getStockPrice(ticker, callback) {
  var _patchTicker = patchTicker(ticker);
  
  $.get(window.App.endpoints.getStockInfo + "?ticket=" + _patchTicker, function (price) {
    var clean = price.replace(/,|</g, "");
    var float = parseFloat(clean).toFixed(2);
    callback(float);
  });
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

function getCashValue () {
  return formatPrice(App.datalayer.currentPortfolioCash)
}

function getToalUsStocksValue () {
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

function getToalIndiaStocksValue () {
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

function triggerPossibleAutoMergeMessage (args) {
  var cashPercent = args.cashPercent;
  var usPercent = args.usPercent;
  var indiaPercent = args.indiaPercent;

  var message = '(WARNING: Your portfolio needs to be re-balance to follow the 70/30 rule)';
  var button = "<button style='font-size: 10px' onclick='window.rebalance()'> Auto Balance</button>";

  if (usPercent > 0 && indiaPercent > 0) {
      $("#auto-balance-error").html(message);
      $("#auto-balance-error").append(button);
    } else {
      $("#auto-balance-error").html('');
    }

  // $.ajax(window.App.endpoints.rebalance, {
  //   method: 'post',
  //   success: function (data) {
  //     if (data.needRebalance) {
  //       $("#auto-balance-error").html(message);
  //       $("#auto-balance-error").append(button);
  //     } else {
  //       $("#auto-balance-error").html('');
  //     }
  //   },
  //   data: {
  //     portfolio_id: window.getCurrentPortfolioId(),
  //     cash: getCashValue(),
  //     domesticStockValue: getToalUsStocksValue(),
  //     foreignStockValue: getToalIndiaStocksValue(),
  //     function: 'needRebalance'
  //   }
  // });



}

function renderPercentageAllocation () {
  

  var cash = getCashValue();
  var usStocks = getToalUsStocksValue();
  var indiaStocks = getToalIndiaStocksValue();
  
  var total = cash + usStocks + indiaStocks;

  var cashPercent = formatPrice((cash / total) * 100);
  var usPercent = formatPrice((usStocks / (usStocks + indiaStocks)) * 100);
  var indiaPercent = formatPrice((indiaStocks / (usStocks + indiaStocks)) * 100);
  
  triggerPossibleAutoMergeMessage({
    cashPercent: cashPercent,
    usPercent: usPercent,
    indiaPercent: indiaPercent
  });
  
  $("#cash-percent").html(cashPercent || 0);
  $("#us-percent").html(usPercent || 0);
  $("#india-percent").html(indiaPercent || 0);
}



function rebalance() {
  $.ajax(window.App.endpoints.rebalance, {
    method: 'post',
    success: function (data) {
      console.log(data);
      window.App.Portfolio.loadPortfolioById();
    },
    data: {
      portfolio_id: window.getCurrentPortfolioId(),
      cash: getCashValue(),
      domesticStockValue: getToalUsStocksValue(),
      foreignStockValue: getToalIndiaStocksValue(),
      function: 'rebalance',
      usStockLeastReturnTicker: getUsLRS(),
      usStockMostReturnTicker: getUsMRS(),
      indiaStockLeastReturnTicker: getInLRS(),
      indiaStockMostReturnTicker: getInMRS()
    }
  });
}

setTimeout(renderPercentageAllocation, 1000);
setInterval(renderPercentageAllocation, 1000);

function calculateReturnValue (ticker, livePrice) {
  try {
    var userStocks = window.App.datalayer.currentStocksForCurrentView;
    var stock = null;

    for (let index = 0; index < userStocks.length; index++) {
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


function isFirstTimeBuyer (ticker) {
  var firstTime = true;
  var trans = window.App.datalayer.stockTransactions;
  console.log('');
  
  for (var index = 0; index < trans.length; index++) {
    var tran = trans[index];
    if (patchTicker(tran.id) == patchTicker(ticker)) {
      firstTime = false;
    }
  }

  return firstTime;
}

