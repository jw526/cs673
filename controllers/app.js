/**
 * @author Michael Citro
 * @summary This is the main js will that will initalize the App name space
 */

// Init App..
window.App = window.App || {};
window.App.datalayer = {
  selectedPortfolioId: null // the currently selected PortfolioId
};

window.App.isLocalHost = window.location.href.indexOf('~mc332') === -1;

// Endpoints will go here
window.App.endpoints = {
  login: window.App.isLocalHost ? '/apis/login.php' : '/~mc332/cs673/apis/login.php',
  addCashPortfolio: window.App.isLocalHost ? '/apis/addCashPortfolio.php' : '/~mc332/cs673/apis/addCashPortfolio.php',
  getCashPortfolio: window.App.isLocalHost ? '/apis/getCashPortfolio.php' : '/~mc332/cs673/apis/getCashPortfolio.php',
  addNewPortfolio: window.App.isLocalHost ? '/apis/addNewPortfolio.php' : '/~mc332/cs673/apis/addNewPortfolio.php',
  deletePortfolio: window.App.isLocalHost ? '/apis/deletePortfolio.php' : '/~mc332/cs673/apis/deletePortfolio.php',
  logout: window.App.isLocalHost ? '/apis/logout.php' : '/~mc332/cs673/apis/logout.php',
  getUserPortfolio: window.App.isLocalHost ? '/apis/getUserPortfolios.php' : '/~mc332/cs673/apis/getUserPortfolios.php',
  getPortfolioById: window.App.isLocalHost ? '/apis/getPortfolioById.php' : '/~mc332/cs673/apis/getPortfolioById.php',
  getUserInfo: window.App.isLocalHost ? '/apis/getUserInfo.php' : '/~mc332/cs673/apis/getUserInfo.php'
}

//All Pages in out app
window.App.pages = {
  myAccount: window.App.isLocalHost ? '/pages/accountView.php' : '/~mc332/cs673/pages/accountView.php',
  portfolioView: window.App.isLocalHost ? '/pages/portfolioView.php' : '/~mc332/cs673/pages/portfolioView.php',
  stockView: window.App.isLocalHost ? '/pages/stockView.php' : '/~mc332/cs673/pages/stockView.php',
  login: window.App.isLocalHost ? '/' : '/~mc332/cs673/'
}


// function that init a page
App.init = {
  LoginScreen: initLoginScreen,
  MyAccount: initMyAccount,
  MyPortfolio: initMyPortfolio
}


// -- initalization functions --
function allPagesInit (params) {
  $("#search-stock-form").on('submit', function (event) {
    event.preventDefault();
    var stock = event.target['search-input-feild'].value;
    
    if ((dow30.concat(indiaStocks)).indexOf(stock) === -1) {
      alert('Sorry Stock Not Found');
      return;
    }

    $("#stock-modal-title").html(stock);
    $('#view-stock-modal').modal();
  });

  window.App.Portfolio.getPortfoliosForBuyModal();
}

function initMyAccount() {
  window.App.User.getUserBasicInfo([
    window.App.Portfolio.loadUserPortfolios
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