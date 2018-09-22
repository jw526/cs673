<?php 
header('Content-Type: application/json');
ob_start();
session_start();

///-----------------------------------------------------------------
/// Connecting to the database
///-----------------------------------------------------------------
DEFINE ('DBUSER', 'mikecit22');
DEFINE ('DBPW', 'root');
DEFINE ('DBHOST', '35.185.105.146');
DEFINE ('DBNAME', 'investments_management_system');

if ($dbc = mysqli_connect(DBHOST, DBUSER, DBPW, DBNAME)) {

    if (!$dbc) {
    	 echo "Could not select the database!<br />";
         exit();
    }
} else {
	 echo "Could not connect to databese!<br />";
     exit();
}
?>