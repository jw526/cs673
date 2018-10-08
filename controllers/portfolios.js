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
    removeCashPortfolio: _removeCashPortfolio,
    toggleRemoveCashModal: _toggleRemoveCashModal,
    addCashPortfolio: _addCashPortfolio,
    getCashPortfolio: _getCashPortfolio,
    investCashPortfolio: _investCashPortfolio,
    loadCashAccount: _loadCashAccount
    //getPortfoliosForBuyModal: _getPortfoliosForBuyModal
  }


  function _loadCashAccount() {
    $.ajax(window.App.endpoints.getCashPortfolio, {
      method: 'post',
      success: function (data) {
        var transactions = data.cashTransactions;
        var totalCashLeft = getTotalCashByTransaction(transactions);
        window.App.datalayer.currentPortfolioCash = totalCashLeft || 0;
        $("#cash-account-balance").html(totalCashLeft.toFixed(2) || 0);
      },
      data: {
        portfolioId: 0
      }
    }); 
  }

  function _getCashPortfolio(pid, callback) {
    var portfolioId = pid || window.getCurrentPortfolioId();

    $.ajax(window.App.endpoints.getCashPortfolio, {
      method: 'post',
      success: function (data) {
        var transactions = data.cashTransactions;
        var totalCashLeft = getTotalCashByTransaction(transactions);

        if (typeof callback == 'function') {
          return callback(totalCashLeft);
        }
        window.App.datalayer.currentPortfolioCash = formatPrice(totalCashLeft) || 0;
        $("#cash-account-balance").html(formatPrice(totalCashLeft).toFixed(2) || 0);
      },
      data: {
        portfolioId: portfolioId || 0
      }
    });
  }

  function _investCashPortfolio(amount) {
    var portfolioId = window.getCurrentPortfolioId();

    $.ajax(window.App.endpoints.investeCashPortfolio, {
      method: 'post',
      success: function (params) {
        _getCashPortfolio();
      },
      data: {
        portfolioId: portfolioId,
        cashAmount: amount
      }
    });
  }


  function _removeCashPortfolio () {
    var amount = $("#remove-cash-amount").val();

    _investCashPortfolio(amount);
    _addCashPortfolio(amount, true, false, true);    
    _toggleRemoveCashModal();
  }

  function _addCashPortfolio(totalValue, backgroundJob, shouldRemoveFromCashAccount, isCashAccount) {
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

    if (isCashAccount) {
      portfolioId = 0;
    }

    if (!amount) {
      return;
    } else {
      $.ajax(window.App.endpoints.addCashPortfolio, {
        method: 'post',
        success: function () {
          _loadPortfolioById();
          

          if (shouldRemoveFromCashAccount) {
            removeCashAccount(amount);
          }

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

  function _toggleRemoveCashModal() {
    $('#remove-cash-modal').modal('toggle');
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

        _getCashPortfolio(window.App.datalayer.selectedPortfolioId, function (cashInPortfolio) {
          addToCashAccount(cashInPortfolio, _loadCashAccount);
        });

        _getStocksByPortfolioId(window.App.datalayer.selectedPortfolioId, function(stocks) {
          for (let index = 0; index < stocks.length; index++) {
            const stock = stocks[index];
            addStockValueToCashAccunt(stock);
          }
        });


        function addStockValueToCashAccunt(stock) {
          _getStockPrice(stock.id, function (price) {
            var isIndia = isIndianStock(stock.id);
            var usds = price;

            if (isIndia) {
              usds = price * window.indiaConverionRate;
            }

            addToCashAccount(stock.qty * usds, _loadCashAccount);
          });
        }



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
        // renerPortfoliosOnModal(data);
      }
    });
  }

  // function _getPortfoliosForBuyModal() {
  //   $.ajax(window.App.endpoints.getUserPortfolio, {
  //     method: 'post',
  //     success: renerPortfoliosOnModal
  //   });
  // }


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

    window.App.datalayer.stockTransactions = res.stocks;

    var isTransactionsView = window.location.href.indexOf(window.App.pages.portfolioView) === -1;

    var stocks = isTransactionsView
      ? res.stocks
      : window.App.Stocks.aggregate(res.stocks)


    if (!isTransactionsView) {
      triggerPossibleAlert(stocks);
    }

    // store stocks for latter use
    window.App.datalayer.currentStocksForCurrentView = stocks;
    
    setTimeout(renderPercentageAllocation, 1000);

    for (var index = 0; index < stocks.length; index++) {
      var portfolio = stocks[index];
      // Clone template
      var template = $("#portfolio-row-template").clone(true);

      // Set Data
      template.children('.id').html(patchTicker(portfolio.id));
      template.children('.qty').html(portfolio.qty);
      template.children('.buy-price').html('$' + portfolio.price);
      template.children('.action').html(portfolio.action);
      template.children('.date').html(portfolio.transaction_date);
      template.children('.total-spent').html('$' + portfolio.totalSpent);

      template.children('.current-value').attr('id', 'stock-ticker-' + portfolio.id.replace(/\.|&/, "_"));

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

    for (var index = 0; index < res.portfolios.length; index++) {
      var portfolio = res.portfolios[index];
      // Clone template
      render(portfolio);
    }


    function render(portfolio) {
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

function addToCashAccount(amount, callback) {
  $.ajax(window.App.endpoints.addCashPortfolio, {
    method: 'post',
    success: callback || function() {},
    data: {
      cashAmount: amount,
      portfolioId: 0
    }
  });
}

function removeCashAccount(amount) {
  $.ajax(window.App.endpoints.investeCashPortfolio, {
    method: 'post',
    data: {
      cashAmount: amount,
      portfolioId: 0
    }
  });
}


function getTotalCashByTransaction(transactions) {
  var totalCashLeft = 0;

  for (var index = 0; index < transactions.length; index++) {
    var transaction = transactions[index];
    if (transaction.cash_action == "add") {
      totalCashLeft += parseFloat(transaction.cash_amount);
    } else {
      totalCashLeft -= parseFloat(transaction.cash_amount);
    }
  }

  return formatPrice(totalCashLeft);
}

function _getStocksByPortfolioId(portfolioId, callback) {
  $.ajax(window.App.endpoints.getPortfolioById, {
    method: 'post',
    success: function (res) {
      callback(window.App.Stocks.aggregate(res.stocks));
    },
    data: { id: portfolioId }
  });
}

function triggerPossibleAlert(stocks) {  
  if (stocks.length >= 1 && stocks.length < 7) {
    $("#stock-amount-owned-error").html('number of stocks must be minimum 7');
    $("#search-input-feild").attr('disabled', false);
  } else if (stocks.length >= 10) {
    $("#stock-amount-owned-error").html('number of stocks must be at most 10. Search Disabled!');
    $("#search-input-feild").attr('disabled', true)
  } else {
    $("#stock-amount-owned-error").html('');
    $("#search-input-feild").attr('disabled', false);
  }
}
