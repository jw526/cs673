<!DOCTYPE html>
<html>
  <?php include('./partials/header.php'); ?>
<body>

<style>
  #upload-form{
        width: 335px;
    display: inline-block;
    border: 1px solid black;
  }
</style>

  <h1 class="center">My Stocks</h1>
    <div class="center">
    Cash: <span id="cash-percent">...</span>% |
    US Stock: <span id="us-percent">...</span>% |
    India Stock: <span id="india-percent">...</span>%
  </div>
  <div id="stock-amount-owned-error" style="color:red" class="center"></div>
  <div id="auto-balance-error" style="color:red" class="center"></div>
  <div class="center">Cash Balance: $<span id="cash-account-balance">0</span></div>

  <div class="center">
    <form id="upload-form" action="" method="POST" enctype="multipart/form-data">
      <div class="form-group">
        <input type="file" name="orderfile" class="form-control-file" id="exampleFormControlFile1">
        <button type="submit"> upload</button>
      </div>
    </form>
  </div>

  <!-- Action Bar -->
  <div class="header-button-container">
    <button class="btn btn-primary" onclick="$('#add-cash-modal').modal('toggle')">Add Cash</button>
    <button class="btn btn-danger" onclick="window.App.Portfolio.toggleRemoveCashModal()">Remove Cash</button>
    <button class="btn btn-success" type="button" onclick="window.App.pages.portfolioTransactionView()">View Stock Transactions</button>
    <button class="btn btn-success" type="button" onclick="window.downloadPortfolio()">Download</button>
  </div>

  <!-- Table View -->
  <table class="table portfolio-table">
    <thead>
      <tr>
        <th scope="col">Ticker</th>
        <th scope="col">Quantity</th>
        <th scope="col">Live Value</th>
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
          <select class="custom-select" id="sell-from-trans" name="sell-from-trans">
            <option selected>Pick Stock Transaction</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select> 

          <br />
          <br />
          <div class="input-group input-group-sm mb-3">
            <input placeholder="how many are you selling?" id="amount-of-stock-to-sell" type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
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

    $("#upload-form").on('submit', function (event) {
      event.preventDefault();
      var file = event.target.orderfile.value;

      $.ajax('/~mc332/cs673/apis/orderfile.php', {
        method: 'post',
                // Form data
        data: new FormData($("#upload-form")[0]),

        // Tell jQuery not to process data or worry about content-type
        // You *must* include these options!
        cache: false,
        contentType: false,
        processData: false,

        success: function (data) {
          console.log(data);

          var response = [];

          for (var index = 0; index < data.actions.length; index++) {
            var action = data.actions[index];
            action.qty = parseFloat(action.qty);
            response.push(action)
          }

          //console.log(response);
          window.handleOrderUploadData(response);
        },
        // data: {
        //   portfolio_id: file
        // }
      });
    })



  </script>
</body>
</html>