/**
 * @author Michael Citro
 */

window.App = window.App || {};

// This will init all user controllers
(function (App) {

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
    console.log('NOTE WE NEED REAL WORLD VALUE');
    var currentPrice = 22;

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
        price: totalValue
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

    // request stock info
    $.ajax(window.App.endpoints.getStockInfo, {
      method: 'post',
      success: function (data) {

        // Display Info
        $("#stock-modal-title").html(stock);
        $('#view-stock-modal').modal();
        $("#search-stock-price").html(data.price);

        window.App.datalayer.searchStockData.price = data.price;
      },
      data: {
        ticker: window.App.datalayer.searchStockData.ticker,
      }
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

