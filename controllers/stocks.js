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

    for (let index = 0; index < stocksInPortfolio.length; index++) {
      const stock = stocksInPortfolio[index];
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
    stocks.forEach(stock => {
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
    });

    var keys = Object.keys(stocksMap);
    var aggregatedStocks = [];

    for (var index = 0; index < keys.length; index++) {
      var stock = keys[index];

      var totalQtyBought = stocksMap[stock]['buy']
        ? stocksMap[stock]['buy']
            .map(stock => stock.qty)
            .reduce((prev, next) => parseFloat(prev) + parseFloat(next))
        : 0;

      var totalPriceBought = stocksMap[stock]['buy']
        ? stocksMap[stock]['buy']
            .reduce(function(prev, current) {
              var currentBought = parseFloat(current.qty) * parseFloat(current.price);
              return prev + currentBought;
            }, 0)
        : 0;

      var totalQtySold = stocksMap[stock]['sell']
        ? stocksMap[stock]['sell']
          .map(stock => stock.qty)
          .reduce((prev, next) => parseFloat(prev) + parseFloat(next))
        : 0;

      var totalPriceSold = stocksMap[stock]['sell']
        ? stocksMap[stock]['sell']
          .reduce(function (prev, current) {
            var currentBought = parseFloat(current.qty) * parseFloat(current.price);
            return prev + currentBought;
          }, 0)
        : 0;

      aggregatedStocks.push({
        id: stock,
        qty: totalQtyBought - totalQtySold,
        totalSpent: totalPriceBought - totalPriceSold,
        company_name: stocksMap[stock].company_name,
        stock_market: stocksMap[stock].stock_market
      });

    }

    return aggregatedStocks;
  }
})(window.App)

