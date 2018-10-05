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
    getCashPortfolio: _getCashPortfolio,
    investCashPortfolio: _investCashPortfolio,
    getPortfoliosForBuyModal: _getPortfoliosForBuyModal
  }



  function _getCashPortfolio() {
    var portfolioId = window.getCurrentPortfolioId();

    $.ajax(window.App.endpoints.getCashPortfolio, {
      method: 'post',
      success: function (data) {
        var transactions = data.cashTransactions;
        var totalCashLeft = 0;

        for (var index = 0; index < transactions.length; index++) {
          const transaction = transactions[index];
          if (transaction.cash_action == "add") {
            totalCashLeft += parseFloat(transaction.cash_amount);
          } else {
            totalCashLeft -= parseFloat(transaction.cash_amount);
          }
        }



        window.App.datalayer.currentPortfolioCash = totalCashLeft || 0;
        $("#cash-account-balance").html(totalCashLeft || 0);
      },
      data: {
        portfolioId: portfolioId
      }
    });
  }

  function _investCashPortfolio(amount) {
    var portfolioId = window.getCurrentPortfolioId();

    $.ajax(window.App.endpoints.investeCashPortfolio, {
      method: 'post',
      success: _getCashPortfolio,
      data: {
        portfolioId: portfolioId,
        cashAmount: amount
      }
    });
  }


  function _addCashPortfolio(totalValue, backgroundJob) {
    var amount

    if (totalValue) {
      amount = totalValue;
    } else {
      amount = $("#add-cash-amount").val();
    }
    
    var portfolioId = null;

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
          
          if (!backgroundJob) {
            $('#add-cash-modal').modal('toggle');
          }
          
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
    setTimeout(function() {
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
      success: function(data) {
        renderPortfolioRows(data);
        renerPortfoliosOnModal(data);
      }
    });
  }

  function _getPortfoliosForBuyModal() {
    $.ajax(window.App.endpoints.getUserPortfolio, {
      method: 'post',
      success: renerPortfoliosOnModal
    });
  }


  function _loadPortfolioById(event) {
    var portfolioId = window.getCurrentPortfolioId();

    _getCashPortfolio();

    $.ajax(window.App.endpoints.getPortfolioById, {
      method: 'post',
      success: renderStocksInPortfolio,
      data: { id: portfolioId }
    });
  }

  // Note i am doing stocks and transaction table in a single function, we may want to move this out if it gets to complicated
  function renderStocksInPortfolio (res) {
    var table = $("#portfolio-table-body");
    var temp = $("#portfolio-row-template").clone(true);
    table.html('');
    table.append(temp);

    var isTransactionsView = window.location.href.indexOf(window.App.pages.portfolioView) === -1;

    var stocks = isTransactionsView
      ? res.stocks
      : window.App.Stocks.aggregate(res.stocks)

    // store stocks for latter use
    window.App.datalayer.currentStocksForCurrentView = stocks;
    
    for (let index = 0; index < stocks.length; index++) {
      const portfolio = stocks[index];
      // Clone template
      var template = $("#portfolio-row-template").clone(true);

      // Set Data
      template.children('.id').html(portfolio.id);
      template.children('.qty').html(portfolio.qty);
      template.children('.buy-price').html('$' + portfolio.price);
      template.children('.action').html(portfolio.action);
      template.children('.date').html(portfolio.transaction_date);
      template.children('.total-spent').html('$' + portfolio.totalSpent);

      // Remove not needed attributes
      template.removeClass('template');
      template.removeAttr('id');


      // template.on('click', function (params) {
      //   window.location.href = window.App.pages.stockView + '?id=' + portfolio.id;
      // });

      //append to table
      table.append(template);  
    }
  }


  /**
   * 
   * @param {Object} res - this is the api response
   * @summary this will render all portfolios that the user has and renders it to the table
   */
  function renderPortfolioRows(res) {
    var table = $("#portfolio-table-body");
    var temp = $("#portfolio-row-template").clone(true); 

    table.html('');
    table.append(temp);

    for (let index = 0; index < res.portfolios.length; index++) {
      const portfolio = res.portfolios[index];
      // Clone template
      var template = $("#portfolio-row-template").clone(true);

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
    }
  }


  // function renerPortfoliosOnModal (res) {
  //   var selectFeild = $("#portfolio-list-for-buy");
  //   selectFeild.html('');

  //   selectFeild.append("<option selected>Choose...</option>");
  //   res.portfolios.forEach(function(portfolio) {
  //     selectFeild.append("<option value=" + portfolio.id + ">" + portfolio.name + "</option>");
  //   });
  // }

})(window.App)

function getCurrentPortfolioId () {
  try {
    return (new URLSearchParams(window.location.search)).get('id');
  } catch (ex) {
    console.error('Most Likly IE browser');
    return window.location.search.split('id')[1].split('&')[0].replace('=', '');
  }
}