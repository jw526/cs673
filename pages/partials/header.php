<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>My Stock App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    <?php 
      include(dirname(__FILE__). '/../../index.css');
      include(dirname(__FILE__). '/../../libs/bootstrap/css/bootstrap-grid.min.css');
      include(dirname(__FILE__). '/../../libs/jquery-ui.min.css');
      include(dirname(__FILE__). '/../../libs/bootstrap/css/bootstrap-reboot.min.css');
      include(dirname(__FILE__). '/../../libs/bootstrap/css/bootstrap.min.css');
    ?>
  </style>

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="/~mc332/cs673/pages/accountView.php">My Account</a>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0" id="search-stock-form">
        <input id="search-input-feild" name="search-input-feild" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outlined my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>

    <!-- Stock Search Modal -->
    <div class="modal" tabindex="-1" role="dialog" id="view-stock-modal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="stock-modal-title">?</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">

            <div class="input-group mb-3">
              <select class="custom-select" id="inputGroupSelect02">
                <option selected>Choose...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
              <div class="input-group-append">
                <label class="input-group-text" for="inputGroupSelect02">Portfolio</label>
              </div>
            </div>


            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="4 ex." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                <span class="input-group-text" id="basic-addon2">Amount?</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success">Buy</button>
          </div>
      </div>
    </div>
  </nav>
</head>