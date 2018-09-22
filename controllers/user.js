/**
 * @author Michael Citro
 * @summary This will expose user controller in our app
 */

window.App = window.App || {};

// This will init all user controllers
(function(App) {

  // This will expose the user controller
  App.User = {
    getUserBasicInfo: _getUserInfo
  }


  function _getUserInfo() {
    App.ajax(App.endpoints.getUserBasicInfo)
  }

})(window.App)