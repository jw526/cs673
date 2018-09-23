<!DOCTYPE html>
<html>
  <?php include('./partials/header.php'); ?>
<body>

  <div>
    <button class="btn btn-primary" type="submit">Add Portfolio</button>
  </div>
  <table class="table table-striped portfolio-table">
    <thead>
      <tr>
        <th scope="col">ticket #</th>
        <th scope="col">Quantity</th>
        <th scope="col">Current Price</th>
        <th scope="col">Profit</th>
      </tr>
    </thead>
    <tbody id="portfolio-table-body">
      <tr id="portfolio-row-template" class="template">
        <th class="ticket-number">1</th>
        <td class="quantity">Mark</td>
        <td class="current-price">Otto</td>
        <td class="profit">@mdo</td>
      </tr>
    </tbody>
  </table>

  <?php include('./partials/footer.php'); ?>
</body>
</html>