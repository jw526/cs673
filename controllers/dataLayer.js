window.App = window.App || {};
window.App.datalayer = {
  selectedStockId: null, // on portfolio view page the stock you selected to sell
  selectedPortfolioId: null, // the currently selected PortfolioId
  searchStockData: {
    stock_market: null,
    ticker: null,
    company_name: null,
    price: null
  },
  currentStocksForCurrentView: [], // on portfolio view page these are all the stocks we are seeing
  currentPortfolioCash: 0,
  currentStockPrices: {},
  currentStockReturnValue: {},
  stockTransactions: []
};

function getCashValue () {
    return formatPrice(App.datalayer.currentPortfolioCash)
}