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
    var currentPrice = window.App.datalayer.currentStockPrices[selectedStockId];

    for (var index = 0; index < stocksInPortfolio.length; index++) {
      var stock = stocksInPortfolio[index];
      if (stock.id == selectedStockId) {
        myStock = stock;
      }
    }

    if (myStock.qty < amountToSell) {
      console.log('You only have ' + myStock.qty)
      return alert('You only have ' + myStock.qty)
    }


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

    _getStockPrice(window.App.datalayer.searchStockData.ticker, function (price) {
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

      // only show stocks we own
      if (totalQtyBought - totalQtySold > 0) {
        aggregatedStocks.push({
          id: stockId,
          qty: totalQtyBought - totalQtySold,
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


function getTotalStockBoughtGivenTransactions(stocksMap, stockId) {
  return getTotalStockQtyGivenTransactions('buy', stocksMap, stockId);
}

function getTotalStockSoldGivenTransactions(stocksMap, stockId) {
  return getTotalStockQtyGivenTransactions('sell', stocksMap, stockId);
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
    _getStockPrice(ticker, function (price) {
      var isIndia = isIndianStock(ticker);
      var truePrice = price;

      if (isIndia) {
        truePrice = formatPrice(price * window.indiaConverionRate);
      }
      
      $("#stock-ticker-" + ticker.replace(/\.|&/, "_")).html(truePrice);
      window.App.datalayer.currentStockPrices[ticker] = truePrice;
    });
  }
}


function _getStockPrice(ticker, callback) {
  var patchTicker;

  if (!ticker) {
    return;
  }

  for (var index = 0; index < indiaStocks.length; index++) {
    var stock = indiaStocks[index];
    if (ticker.split('.')[0] == stock.split('.')[0].split('-')[0]) {
      patchTicker = stock
    }
  }

  //console.log('getting price for ', patchTicker || ticker);
  
  $.get(window.App.endpoints.getStockInfo + "?ticket=" + (patchTicker || ticker), function (price) {
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

  $.ajax(window.App.endpoints.rebalance, {
    method: 'post',
    success: function (data) {
      if (data.needRebalance == 'TRUE') {
        $("#auto-balance-error").html(message);
        $("#auto-balance-error").append(button);
      } else {
        $("#auto-balance-error").html('');
      }
    },
    data: {
      portfolio_id: window.getCurrentPortfolioId(),
      cash: getCashValue(),
      domesticStockValue: getToalUsStocksValue(),
      foreignStockValue: getToalIndiaStocksValue(),
      function: 'needRebalance'
    }
  });



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

setInterval(renderPercentageAllocation, 1000);

function getUsLRS() {
  return null;
}

function getUsMRS() {
  return null;
}

function getInLRS() {
  return null;
}

function getInMRS() {
  return null;
}
