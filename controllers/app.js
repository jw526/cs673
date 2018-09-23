/**
 * @author Michael Citro
 * @summary This is the main js will that will initalize the App name space
 */

// Init App
window.App = window.App || {};


// Endpoints will go here
window.App.endpoints = {
  login: '/apis/login.php',
  getUserPortfolio: '/apis/getUserPortfolios.php'
}


// function that init a page
App.init = {
  LoginScreen: initLoginScreen,
  MyAccount: initMyAccount
}


// -- initalization functions --
function initMyAccount() {
  window.App.User.getUserBasicInfo([
    window.App.Portfolio.loadUserPortfolio
  ]);
}

function initLoginScreen() {
  $("#login-form").on('submit', function (event) {
    event.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;

    window.App.User.login(email, password, function (response) {
      if (response.isUserRegistered) {
        window.location.href = '/pages/accountView.php';
      } else {
        alert('Sorry we could not find you.')
      }
    })
  })
}
