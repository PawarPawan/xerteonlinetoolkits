<?php

//
// Version 1.0 University of Nottingham
// 
// Calls the function from the display library

require_once("../../../config.php");

include "../display_library.php";

include "../user_library.php";

$database_connect_id = database_connect("your templates database connect success", "your templates database connect failed");

$_SESSION['sort_type'] = "date_down";

list_users_projects($_SESSION['sort_type']);		

mysql_close($database_connect_id);

?>
