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

