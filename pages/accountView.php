<!DOCTYPE html>
<html>
  <?php include('./partials/header.php'); ?>
<body>

  <div class="header-button-container">
    <button class="btn btn-primary" onclick="$('#add-port-modal').modal('toggle')">Add Portfolio</button>
    <button class="btn btn-secondary" type="submit">Logout</button>
  </div>
  <table class="table table-striped portfolio-table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Cash%</th>
        <th scope="col">Stock%</th>
        <th scope="col">Total Assets</th>
      </tr>
    </thead>
    <tbody id="portfolio-table-body">
      <tr id="portfolio-row-template" class="template">
        <th class="number">1</th>
        <td class="name">Mark</td>
        <td class="cash">Otto</td>
        <td class="stock">Otto</td>
        <td class="total">@mdo</td>
      </tr>
    </tbody>
  </table>

  <div class="modal" tabindex="-1" role="dialog" id="add-port-modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add New Portfolio</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="input-group input-group-sm mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-sm">Name</span>
            </div>
            <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>

  <?php include('./partials/footer.php'); ?>
  <script>
    window.App.init.MyAccount();
  </script>
</body>
</html>