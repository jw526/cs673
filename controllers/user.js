/**
 * @author Michael Citro
 * @summary This will expose user controller in our app
 */

window.App = window.App || {};

// This will init all user controllers
(function(App) {

  // This will expose the user controller
  App.User = {
    getUserBasicInfo: _getUserInfo,
    login: _login
  }


  function _login (email, password, callback) {
    $.ajax(window.App.endpoints.login, {
      method: 'post',
      success: callback,
      data: {
        email: email,
        password: password
      }
    })  
  }

  function _getUserInfo(callbacks) {
    callbacks.forEach(callback => {
      callback();
    });
    return {
      email: 'mike',
      id: ''
    }
  }

})(window.App)