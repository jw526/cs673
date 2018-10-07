/**
 * @author Michael Citro
 * @summary This is the main js will that will initalize the App name space
 */

window.onerror = function (a, b , c ,d) {
  alert("ERROR!", a, b, c, d);
  console.log(a, b, c, d);
}

// Init App..
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
  currentStockPrices: {
    
  }
};

window.App.isLocalHost = window.location.href.indexOf('~mc332') === -1;

var prefix = window.App.isLocalHost ? '' : '/~mc332/cs673';

// Endpoints will go here
window.App.endpoints = {
  login: prefix + '/apis/login.php',
  addCashPortfolio: prefix + '/apis/addCashPortfolio.php',
  buyStock: prefix + '/apis/buyStock.php',
  sellStock: prefix + '/apis/sellStock.php',
  getCashPortfolio: prefix + '/apis/getCashPortfolio.php',
  investeCashPortfolio: prefix + '/apis/investeCashPortfolio.php',
  addNewPortfolio: prefix + '/apis/addNewPortfolio.php',
  deletePortfolio: prefix + '/apis/deletePortfolio.php',
  logout: prefix + '/apis/logout.php',
  getUserPortfolio: prefix + '/apis/getUserPortfolios.php',
  getPortfolioById: prefix + '/apis/getPortfolioById.php',
  getUserInfo: prefix + '/apis/getUserInfo.php',
  getStockInfo: 'https://web.njit.edu/~mc332/webapps8/hello2'
}

//All Pages in out app
window.App.pages = {
  myAccount: window.App.isLocalHost ? '/pages/accountView.php' : '/~mc332/cs673/pages/accountView.php',
  portfolioView: window.App.isLocalHost ? '/pages/portfolioView.php' : '/~mc332/cs673/pages/portfolioView.php',
  stockView: window.App.isLocalHost ? '/pages/stockView.php' : '/~mc332/cs673/pages/stockView.php',
  login: window.App.isLocalHost ? '/' : '/~mc332/cs673/',
  portfolioTransactionView: function () {
    window.location.href = window.App.isLocalHost
      ? '/pages/portfolioTransactionView.php' + window.location.search
      : '/~mc332/cs673/pages/portfolioTransactionView.php' + window.location.search
  }
}


// function that init a page
App.init = {
  LoginScreen: initLoginScreen,
  MyAccount: initMyAccount,
  MyPortfolio: initMyPortfolio
}


// -- initalization functions --
function allPagesInit (params) {
  $("#search-stock-form").on('submit', App.Stocks.getStockInfo);
  // window.App.Portfolio.getPortfoliosForBuyModal();
}

function initMyAccount() {
  window.App.User.getUserBasicInfo([
    window.App.Portfolio.loadUserPortfolios,
    (function () { window.App.Portfolio.loadCashAccount() })
  ]);

  $("#logout-button").on('click', window.App.User.logout);


}

function initMyPortfolio() {
  window.App.User.getUserBasicInfo([
    window.App.Portfolio.loadPortfolioById
  ]);
}

function initLoginScreen() {
  $("#login-form").on('submit', function (event) {
    event.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;

    window.App.User.login(email, password, function (response) {
      if (response.isUserRegistered) {
        window.location.href = window.App.pages.myAccount;
      } else {
        alert('Sorry we could not find you.')
      }
    })
  })
}

function formatPrice(price) {
  try {
    return parseFloat(price).toFixed(2);
  } catch (error) {
    return price;
  }
}

$.get('https://www.google.com/search?q=INR+conversoin+rate', function (data) {

  try {
    var conversionRate = (parseFloat(data.split('\"knowledge-currency__tgt-amount\"')[1].split(">")[1]));
    window.indiaConverionRate = conversionRate;
    console.log(window.indiaConverionRate + " is the convversion rate");
    
  } catch (error) {
    console.log('Failed to get conversion rate');
    window.indiaConverionRate = 0.014;
  }

})

setTimeout(function () {
  window.indiaConverionRate = window.indiaConverionRate || 0.014;
}, 1000);