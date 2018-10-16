/**
 * @author Michael Citro
 */

 /**
  * 
  * @param {*} ticker 
  * @param {*} callback 
  */
function getStockPriceByTicker(ticker, callback) {
  var _patchTicker = patchTicker(ticker);
  
  $.get(window.App.endpoints.getStockInfo + "?ticket=" + _patchTicker, function (price) {
    var clean = price.replace(/,|</g, "");
    var float = parseFloat(clean);
    currentStockPrices[_patchTicker] = float;
    callback(float);
  });
}

/**
 * 
 * @param {*} callback 
 */
function rebalance(callback) {
  $.ajax(window.App.endpoints.rebalance, {
    method: 'post',
    success: callback,
    data: {
      portfolio_id: window.getCurrentPortfolioId(),
      cash: getCashValue(),
      domesticStockValue: getToalUsStocksValue(),
      foreignStockValue: getToalIndiaStocksValue(),
      function: 'rebalance',
      usStockLeastReturnTicker: getUsLRS(),
      usStockMostReturnTicker: getUsMRS(),
      indiaStockLeastReturnTicker: patchTicker(getInLRS()),
      indiaStockMostReturnTicker: patchTicker(getInMRS())
    }
  });
}

/**
 * 
 * @param {*} args
 * @param {*} args.ticker
 * @param {*} args.qty
 * @param {*} args.pricePerStock
 * @param {*} callback 
 */
function buyStock(args, callback) {
  if (window.getUserCash() <  (args.qty * args.pricePerStock)) {
    alert('You Do not Have Cash For ' + args.qty + " of " + args.ticker + ". You have $" + window.getUserCash() + " but need $" + (args.qty * args.pricePerStock));
  };

  window.buyOrSellStock(args, callback, window.App.endpoints.buyStock);
}

/**
 * 
 * @param {*} args
 * @param {*} args.ticker
 * @param {*} args.qty
 * @param {*} args.pricePerStock
 * @param {*} callback 
 */
function sellStock(args, callback) {
    if (window.getUserStockQty(args.ticker) < args.qty) {
      alert('You Do not Have ' + args.qty + " of " + args.ticker);
    };

    window.buyOrSellStock(args, callback, window.App.endpoints.sellStock);
}

/**
 * 
 * @param {*} args 
 * @param {*} callback 
 * @param {*} endpoint 
 */
function buyOrSellStock (args, callback, endpoint) {
  var requestData = {
    portfolio_id: window.getCurrentPortfolioId(),
    stock_market: window.getMarketByTicker(args.ticker),
    ticker: args.ticker,
    company_name: args.ticker,
    quantity: args.qty,
    price: args.pricePerStock
  }

  window.apiHelper({
      endpoint: endpoint,
      requestData: requestData,
      callback: callback
  });
}

/**
 * 
 * @param {*} endpoint 
 * @param {*} requestData
 * @param {*} callback
 */
function apiHelper(args) {
    $.ajax(args.endpoint, {
        method: args.method || 'post',
        success: function(data) {
            args.callback(data, window.datalayer);
        },
        data: args.requestData
    });
}