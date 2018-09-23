<!DOCTYPE html>
<html>
  <?php include('./partials/header.php'); ?>
<body>

  <!-- Action Bar -->
  <div class="header-button-container">
    <button class="btn btn-primary" onclick="$('#add-port-modal').modal('toggle')">Add Portfolio</button>
    <button class="btn btn-secondary" type="submit">Logout</button> <br/>
    <div class="center" style="width:400px; display:inline-block; margin-top:10px;">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="appl">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
        </div>
      </div>
    </div>

  </div>

  <!-- Table View -->
  <table class="table portfolio-table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Cash%</th>
        <th scope="col">Stock%</th>
        <th scope="col">Total Assets</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody id="portfolio-table-body">
      <tr id="portfolio-row-template" class="template portfolio-row">
        <th class="number">1</th>
        <td class="name">Mark</td>
        <td class="cash">Otto</td>
        <td class="stock">Otto</td>
        <td class="total">@mdo</td>
        <td class="delete">
          <button class="btn btn-danger" onclick="$('#delete-port-modal').modal('toggle')">delete</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Add New Portfolio Modal -->
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

  <!-- Delete Portfolio Modal -->
  <div class="modal" tabindex="-1" role="dialog" id="delete-port-modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Portfolio?</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p> Are you sure you want to delete? All stocks will be sold if so.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger">Delete</button>
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