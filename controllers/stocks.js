/**
 * @author Michael Citro
 */

window.App = window.App || {};

// This will init all user controllers
(function (App) {

  // This will expose the user controller
  App.Stocks = {
    buyStock: _buyStock,
    getStockInfo: _getStockInfo
  }


  function _buyStock() {
    let porfolioId = $("#portfolio-list-for-buy").val();
    let qty = $("#stock-buy-qty").val();


    $.ajax(window.App.endpoints.buyStock, {
      method: 'post',
      success: function (data) {
        $('#view-stock-modal').modal('toggle');
        $("#stock-modal-title").html('');
        $("#search-stock-price").html('');
        alert('transaction complete');
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

})(window.App)

