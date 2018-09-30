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
    login: _login,
    logout: _logout
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

  function _logout () {
    $.ajax(window.App.endpoints.logout, {
      method: 'post',
      success: _getUserInfo,
    })  
  }

  function _getUserInfo(callbacks) {
    $.ajax(window.App.endpoints.getUserInfo, {
      method: 'post',
      success: successCallbacks
    });


    function successCallbacks (data) {
      if (!data.isUserRegistered) {
        window.location.href = window.App.pages.login;
      } else {
        callbacks.forEach(callback => {
          callback();
        });
      }
    }
  }

})(window.App)