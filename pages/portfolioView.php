<!DOCTYPE html>
<html>
  <?php include('./partials/header.php'); ?>
<body>

  <h1 class="center">My Stocks</h1>
  <div class="center">Cash Balance: $<span id="cash-account-balance">0</span></div>

  <!-- Action Bar -->
  <div class="header-button-container">
    <button class="btn btn-primary" onclick="$('#add-cash-modal').modal('toggle')">Add Cash</button>
    <button class="btn btn-danger">Remove Cash</button>
    <button class="btn btn-success" type="submit">View Report</button>
    <button class="btn btn-success" type="submit">Download Report</button>
  </div>

  <!-- Table View -->
  <table class="table portfolio-table">
    <thead>
      <tr>
        <th scope="col">Ticker</th>
        <th scope="col">Quantity</th>
        <th scope="col">Buy Price</th>
        <th scope="col">Total Spent</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody id="portfolio-table-body">
      <tr id="portfolio-row-template" class="template portfolio-row">
        <th class="id"></th>
        <td class="qty"></td>
        <td class="buy-price"></td>
        <td class="total-value"></td>
        <td class="actions">
          <!-- <button class="btn btn-success">Buy</button> -->
          <button class="btn btn-danger">Sell</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Add New Portfolio Modal -->
  <div class="modal" tabindex="-1" role="dialog" id="add-cash-modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Cash Tp Portfolio</h5>
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
          <button type="button" class="btn btn-primary" onclick="window.App.Portfolio.addCashPortfolio(this)">Add Cash</button>
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