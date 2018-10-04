<!DOCTYPE html>
<html>
  <style>
    #navigation-bar {
      display: none;
    }
  </style>
  <?php include('./pages/partials/header.php'); ?>
<body class="center">
  <form class="login-form" id="login-form">
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
    </div>
    <!-- GG --> 
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>

  <?php include('./pages/partials/footer.php'); ?>
  <script type="text/javascript">
    window.App.init.LoginScreen();
  </script>
</body>
</html>
