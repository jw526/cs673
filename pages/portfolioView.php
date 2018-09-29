<!DOCTYPE html>
<html>
  <?php include('./partials/header.php'); ?>
<body>

  <h1 class="center">My Stocks</h1>

  <!-- Action Bar -->
  <div class="header-button-container">
    <button class="btn btn-primary">Add Cash</button>
    <button class="btn btn-danger">Remove Cash</button>
    <button class="btn btn-success" type="submit">View Report</button>
    <button class="btn btn-success" type="submit">Download Report</button>
  </div>

  <!-- Table View -->
  <table class="table portfolio-table">
    <thead>
      <tr>
        <th scope="col">Ticket Number</th>
        <th scope="col">Quantity</th>
        <th scope="col">Profit</th>
        <th scope="col">Current Price</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody id="portfolio-table-body">
      <tr id="portfolio-row-template" class="template portfolio-row">
        <th class="id"> APPL</th>
        <td class="qty"> 32</td>
        <td class="profit"> $323,432</td>
        <td class="currentPrice"> $200</td>
        <td class="actions">
          <button class="btn btn-success">Buy</button>
          <button class="btn btn-danger">Sell</button>
        </td>
      </tr>
    </tbody>
  </table>

  <?php include('./partials/footer.php'); ?>
  <script>
    window.App.init.MyPortfolio();
  </script>
</body>
</html>