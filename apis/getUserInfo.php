<?php
  include('./__init__.php');

  ///-----------------------------------------------------------------------
  /// Selecting personal info (function located in edit_personal_info && in user)
  ///-----------------------------------------------------------------------
  function fetching_personal_info($user_id) {

      global $dbc;

      $user_id = (int)$user_id;

      $sql = "SELECT last_name,
                      first_name,
                      date_registered,
                      date_login
                FROM users
                WHERE user_id = '$user_id'";

      $result = mysqli_query($dbc, $sql);

      return mysqli_fetch_assoc($result);
  }

  echo fetching_personal_info('3');

?>