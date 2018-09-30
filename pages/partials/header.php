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
      <form class="form-inline my-2 my-lg-0">
        <input id="search-input-feild" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outlined my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </nav>
</head>