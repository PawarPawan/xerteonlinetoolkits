<?PHP /**
* 
* workspace templates template page, used displays the User created
*
* @author Patrick Lockley
* @version 1.0
* @copyright Copyright (c) 2008,2009 University of Nottingham
* @package
*/


	require("../../../config.php");
	require("../../../session.php");

	include "../database_library.php";

	include "../display_library.php";

	/**
	* connect to the database
	*/

	echo "<p class=\"header\"><span>My projects</span></p>";
	
	echo "<div class=\"menu_holder\"><div class=\"menu_button\"><a href=\"javascript:workspace_templates_template()\">My projects</a></div><div class=\"menu_button\"><a href=\"javascript:shared_templates_template()\">Shared projects</a></div><div class=\"menu_button\"><a href=\"javascript:public_templates_template()\">Public projects</a></div><div class=\"menu_button\"><a href=\"javascript:usage_templates_template()\">Usage stats</a></div><div class=\"menu_button\"><a href=\"javascript:rss_templates_template()\">Projects in the RSS</div><div class=\"menu_button\"><a href=\"javascript:syndication_templates_template()\">Open Content projects</a></div><div class=\"menu_button\"><a href=\"javascript:peer_templates_template()\">Peer review</a></div><div class=\"menu_button\"><a href=\"javascript:xml_templates_template()\">XML sharing</a></div></div>";

	$database_connect_id = database_connect("Folder_content_template.php connect success","Folder_content_template.php connect failed");

	$query_for_created_templates = "select * from " . $xerte_toolkits_site->database_table_prefix . "templatedetails where creator_id=\"" . $_SESSION['toolkits_logon_id'] . "\"    ORDER BY date_created DESC";

	$query_created_response = mysql_query($query_for_created_templates);

	echo "<div style=\"clear:left; margin-left:20px; margin-top:10px; width:90%; float:left;\">";

	echo "<div style=\"float:left; position:relative; width:40%; height:20px;\">Name</div>";

	while($row_template_name = mysql_fetch_array($query_created_response)){

		echo "<div style=\"float:left; position:relative; width:35%; clear:left\">" . $row_template_name['template_name'] . "</div>";

	}

	echo "</div>";
	
	echo "</div>";
		
?>