<?php
    include('./__init__.php');
    header('Content-Type: application/json');
    
    global $dbc;
    $username = $_POST['email'];
    $password = $_POST['password'];
    $sql = "
        SELECT *
        FROM users
        WHERE username = '$username'
            AND password = '$password'";

    $result = mysqli_query($dbc, $sql);

    $isUserInSystem = $result->num_rows > 0;

    // Convert To JSON and send back
    $obj = (object) [
        'isUserRegistered' => $isUserInSystem
    ];
    echo json_encode($obj);


    

    while($row = mysqli_fetch_assoc($result)) {          
        $_SESSION["user_id"] = $row["user_id"];
        $_SESSION["username"] = $row["username"];
    } 


    /* free result set */
    mysqli_free_result($result);

    /* Close Connection */
    mysqli_close($dbc);
    
?>