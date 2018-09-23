/**
 * @author Michael Citro
 * @summary This will expose the portfolio controller in our app
 */

window.App = window.App || {};

// This will init all user controllers
(function (App) {

  // This will expose the user controller
  App.Portfolio = {
    loadUserPortfolio: _loadUserPortfolio
  }


  function _loadUserPortfolio() {
    $.ajax(window.App.endpoints.getUserPortfolio, {
      method: 'post',
      success: renderPortfolioRows
    });
  }

  function renderPortfolioRows(res) {
    let table = $("#portfolio-table-body");

    res.portfolios.forEach(portfolio => {
      let template = $("#portfolio-row-template").clone(true);
      template.children('.number').html(portfolio.id);
      template.children('.name').html(portfolio.name);
      template.children('.cash').html(portfolio.cash);
      template.children('.stock').html(portfolio.stock);
      template.children('.total').html(portfolio.total);
      template.removeClass('template');
      table.append(template);
    });
  }

})(window.App)

