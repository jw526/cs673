<?php
  include('./__init__.php');

  $username = $_SESSION["username"];
  $isUserLoggedIn  = isset($_SESSION['username']);

  // Convert To JSON and send back
  $obj = (object) [
      'isUserRegistered' => $isUserLoggedIn
  ];
  echo json_encode($obj);

?>