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
    var apiRes = [{
      id: 'sd',
      qty: 67,
      currentPrice: 78,
      profit: 43.43
    }, {
        id: 'sd',
        qty: 67,
        currentPrice: 78,
        profit: 43.43
      }, {
        id: 'sd',
        qty: 67,
        currentPrice: 78,
        profit: 43.43
      }];

    renderPortfolioRows(apiRes);
  }

  function renderPortfolioRows(portfolios) {
    let table = $("#portfolio-table-body");

    portfolios.forEach(portfolio => {
      let template = $("#portfolio-row-template").clone(true);
      template.children('.ticket-number').html(portfolio.id);
      template.children('.quantity').html(portfolio.qty);
      template.children('.current-price').html(portfolio.currentPrice);
      template.children('.profit').html(portfolio.profit);
      template.removeClass('template');
      table.append(template);
    });
  }

})(window.App)

