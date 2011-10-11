<?PHP     /**
	 * 
	 * export template, allows the site to display the html for the export panel
	 *
	 * @author Patrick Lockley
	 * @version 1.0
	 * @copyright Copyright (c) 2008,2009 University of Nottingham
	 * @package
	 */
	
	require("../../../config.php");
	require("../../../session.php");
	require $xerte_toolkits_site->root_file_path . "languages/" . $_SESSION['toolkits_language'] . "/website_code/php/properties/export_template.inc";


	include "../database_library.php";

	include "../template_status.php";

	include "../url_library.php";

	include "../user_library.php";

	$database_id=database_connect("Export template database connect success","Export template database connect failed");
	
	/*
	* check user has some rights to this template
	*/
	
	if(is_numeric($_POST['template_id'])){

		if(is_user_creator(mysql_real_escape_string($_POST['template_id']), $_SESSION['toolkits_logon_id'])||is_user_admin()){

			echo "<p class=\"header\"><span>" . EXPORT_TITLE . "</span></p>";	

			echo "<p>" . EXPORT_DESCRIPTION . "</p>";
		
			echo "<p>" . EXPORT_ZIP . "<a target=\"new\" href='" . $xerte_toolkits_site->site_url . url_return("export" , $_POST['template_id']) . "'>" . EXPORT_ZIP_LINK . "</a></p>";
			
			echo "<p>" . EXPORT_ZIP_LOCAL . "<a target=\"new\" href='" . $xerte_toolkits_site->site_url . url_return("export_local" , $_POST['template_id']) . "'>" . EXPORT_ZIP_LOCAL_LINK . "</a></p>";
		
			echo "<p>" . EXPORT_SCORM . "<a href='" . $xerte_toolkits_site->site_url . url_return("scorm" , $_POST['template_id']) . "'>" . EXPORT_SCORM_LINK . "</a></p>";
			
			echo "<p>" . EXPORT_SCORM_METADATA . "<a target=\"new\" href='" . $xerte_toolkits_site->site_url . url_return("scorm_rich" , $_POST['template_id']) . "'>" . EXPORT_SCORM_METADATA_LINK . "</a></p>";

		}else{

			echo "<p>". EXPORT_FAIL. "</p>";

		}
	
	}

?>

	