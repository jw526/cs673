/**
 * @author Michael Citro
 * @summary This will expose the portfolio controller in our app
 */

window.App = window.App || {};

// This will init all user controllers
(function (App) {

  // This will expose the user controller
  App.Portfolio = {
    loadUserPortfolios: _loadUserPortfolios,
    loadPortfolioById: _loadPortfolioById
  }


  /**
   * @summary this will call the api to get the user's portfolios and then call the render function
   */
  function _loadUserPortfolios() {
    $.ajax(window.App.endpoints.getUserPortfolio, {
      method: 'post',
      success: renderPortfolioRows
    });
  }


  function _loadPortfolioById(event) {
    let portfolioId = null;

    try {
      portfolioId = (new URLSearchParams(window.location.search)).get('id');
    } catch(ex) {
      console.error('Most Likly IE browser');
      portfolioId = window.location.search.split('id')[1].split('&')[0].replace('=', '');
    }

    $.ajax(window.App.endpoints.getPortfolioById, {
      method: 'post',
      success: renderStocksInPortfolio,
      data: { id: portfolioId }
    });
  }

  function renderStocksInPortfolio (res) {
    let table = $("#portfolio-table-body");

    res.stocks.forEach(portfolio => {
      // Clone template
      let template = $("#portfolio-row-template").clone(true);

      // Set Data
      template.children('.id').html(portfolio.id);
      template.children('.qty').html(portfolio.qty);
      template.children('.profit').html(portfolio.profit);
      template.children('.currentPrice').html(portfolio.currentPrice);

      // Remove not needed attributes
      template.removeClass('template');
      template.removeAttr('id');


      template.on('click', function (params) {
        window.location.href = window.App.pages.stockView + '?id=' + portfolio.id;
      });

      //append to table
      table.append(template);
    });
  }


  /**
   * 
   * @param {Object} res - this is the api response
   * @summary this will render all portfolios that the user has and renders it to the table
   */
  function renderPortfolioRows(res) {
    let table = $("#portfolio-table-body");

    res.portfolios.forEach(portfolio => {
      // Clone template
      let template = $("#portfolio-row-template").clone(true);

      // Set Data
      template.children('.number').html(portfolio.id);
      template.children('.name').html(portfolio.name);
      template.children('.cash').html(portfolio.cash);
      template.children('.stock').html(portfolio.stock);
      template.children('.total').html(portfolio.total);

      // Remove not needed attributes
      template.removeClass('template');
      template.removeAttr('id');


      template.on('click', function (params) {
        window.location.href = window.App.pages.portfolioView + '?id=' + portfolio.id;
      });

      //append to table
      table.append(template);
    });
  }

})(window.App)

