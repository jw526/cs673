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
    loadPortfolioById: _loadPortfolioById,
    addNewPortfolio: _addNewPortfolio,
    deletePortfolio: _deletePortfolio,
    toggleDeleteModal: _toggleDeleteModal,
    addCashPortfolio: _addCashPortfolio,
    getCashPortfolio: _getCashPortfolio
  }



  function _getCashPortfolio() {
    let portfolioId = null;

    try {
      portfolioId = (new URLSearchParams(window.location.search)).get('id');
    } catch (ex) {
      console.error('Most Likly IE browser');
      portfolioId = window.location.search.split('id')[1].split('&')[0].replace('=', '');
    }

    $.ajax(window.App.endpoints.getCashPortfolio, {
      method: 'post',
      success: function (data) {
        $("#cash-account-balance").html(data.totalCash);
      },
      data: {
        portfolioId: portfolioId
      }
    });
  }


  function _addCashPortfolio(element) {
    var amount = $("#add-cash-amount").val();
    let portfolioId = null;

    try {
      portfolioId = (new URLSearchParams(window.location.search)).get('id');
    } catch (ex) {
      console.error('Most Likly IE browser');
      portfolioId = window.location.search.split('id')[1].split('&')[0].replace('=', '');
    }

    if (!amount) {
      return;
    } else {
      $.ajax(window.App.endpoints.addCashPortfolio, {
        method: 'post',
        success: function () {
          _loadPortfolioById();
          $('#add-cash-modal').modal('toggle');
        },
        data: {
          cashAmount: amount,
          portfolioId: portfolioId
        }
      });
    }
  }

  function _toggleDeleteModal(element) {
    var selectedPortfolioId = $($(element).parent().parent().children('.number')[0]).html()

    window.App.datalayer.selectedPortfolioId = selectedPortfolioId;

    // This is a HACK so we dont redirect on row click 
    window.isDontRedirect = true;
    setTimeout(() => {
      window.isDontRedirect = false;
    }, 100);
    // Hack above

    $('#delete-port-modal').modal('toggle');
  }

  function _addNewPortfolio(event) {
    var name = $("#new-portfolio-name").val();

    if (!name) {
      return;
    } else {
      $.ajax(window.App.endpoints.addNewPortfolio, {
        method: 'post',
        success: function()
          {
            _loadUserPortfolios();
            $('#add-port-modal').modal('toggle');
          },
        data: {
          portfolioName: name
        }
      });
    }
  }

  function _deletePortfolio() {
    $.ajax(window.App.endpoints.deletePortfolio, {
      method: 'post',
      success: function() {
          _loadUserPortfolios();
          $('#delete-port-modal').modal('toggle');
      },
      data: {
        portfolioId: window.App.datalayer.selectedPortfolioId
      }
    });
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

    _getCashPortfolio();

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
    let temp = $("#portfolio-row-template").clone(true); 

    table.html('');
    table.append(temp);

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
        if (!window.isDontRedirect) {
          window.location.href = window.App.pages.portfolioView + '?id=' + portfolio.id;
        }
      });

      //append to table
      table.append(template);
    });
  }

})(window.App)

