/**
 * @author Michael Citro
 * @summary This is the main js will that will initalize the App name space
 */

// Init App
window.App = window.App || {};

// We will store the App State Here
window.App.state = {
  userInfo: {
    username: null,
    email: null,
  },
  portfolio: {}
}

// Utils will go here
window.App.utils = {

}

// Endpoints will go here
window.App.endpoints = {
  login: '/apis/login.php'
}

window.App.init = {
  LoginScreen: initLoginScreen
}

function initLoginScreen () {
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