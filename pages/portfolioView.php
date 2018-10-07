<!DOCTYPE html>
<html>
  <?php include('./partials/header.php'); ?>
<body>

  <h1 class="center">My Stocks</h1>
  <div class="center">Cash Balance: $<span id="cash-account-balance">0</span></div>

  <!-- Action Bar -->
  <div class="header-button-container">
    <button class="btn btn-primary" onclick="$('#add-cash-modal').modal('toggle')">Add Cash</button>
    <button class="btn btn-danger" onclick="window.App.Portfolio.toggleRemoveCashModal()">Remove Cash</button>
    <button class="btn btn-success" type="button" onclick="window.App.pages.portfolioTransactionView()">View Transactions</button>
  </div>

  <!-- Table View -->
  <table class="table portfolio-table">
    <thead>
      <tr>
        <th scope="col">Ticker</th>
        <th scope="col">Quantity</th>
        <th scope="col">Current Value</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody id="portfolio-table-body">
      <tr id="portfolio-row-template" class="template portfolio-row">
        <th class="id"></th>
        <td class="qty"></td>
        <td class="current-value">N/A</td>
        <td class="actions">
          <!-- <button class="btn btn-success">Buy</button> -->
          <button class="btn btn-danger" onclick="window.App.Stocks.toggleSellStockModal(this)">Sell</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Add Cash to Portfolio Modal -->
  <div class="modal" tabindex="-1" role="dialog" id="add-cash-modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Cash To Portfolio</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="input-group input-group-sm mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-sm">$</span>
            </div>
            <input id="add-cash-amount" type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick="window.App.Portfolio.addCashPortfolio(null, false, true)">Add Cash</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Remove Cash to Portfolio Modal -->
  <div class="modal" tabindex="-1" role="dialog" id="remove-cash-modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Remove Cash from Portfolio, add to cash account</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="input-group input-group-sm mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="cash-to-remove-from-port">$</span>
            </div>
            <input id="remove-cash-amount" type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick="window.App.Portfolio.removeCashPortfolio(null, false, true)">Remove Cash</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Sell Stock from Portfolio Modal -->
  <div class="modal" tabindex="-1" role="dialog" id="sell-stock-modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Sell Stock?</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="input-group input-group-sm mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="stock-name-to-sell"></span>
            </div>
            <input id="amount-of-stock-to-sell" type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick="window.App.Stocks.sellStock()">Sell Stock!</button>
        </div>
      </div>
    </div>
  </div>



  <?php include('./partials/footer.php'); ?>
  <script>
    window.App.init.MyPortfolio();
  </script>
</body>
</html>