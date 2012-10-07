<?php
require("module_functions.php");

//Function show_template
//
// Version 1.0 University of Nottingham
// (pl)
// Set up the preview window for a xerte piece

function show_template($row_play){
    
	global $xerte_toolkits_site;

	require_once(dirname(__FILE__) . '/module_functions.php');
	
	$row_name = db_query_one("select template_name from {$xerte_toolkits_site->database_table_prefix}templatedetails where template_id=?" , array($row_play['template_id']));
	
	$dir = opendir($xerte_toolkits_site->root_file_path . $xerte_toolkits_site->users_file_area_short . $row_play['template_id'] . "-" . $row_play['username'] . "-" . $row_play['template_name'] . "/ebook/chapters");
	
	while($file = readdir($dir)){
		
		if($file!="."&&$file!=".."){
		
			unlink($xerte_toolkits_site->root_file_path . $xerte_toolkits_site->users_file_area_short . $row_play['template_id'] . "-" . $row_play['username'] . "-" . $row_play['template_name'] . "/ebook/chapters/" . $file);
		
		}
		
	}
	
	$dir = opendir($xerte_toolkits_site->root_file_path . $xerte_toolkits_site->users_file_area_short . $row_play['template_id'] . "-" . $row_play['username'] . "-" . $row_play['template_name'] . "/draft");
	
	$chapters = array();
	
	while($file = readdir($dir)){
		
		if($file!="."&&$file!=".."){
		
			copy($xerte_toolkits_site->root_file_path . $xerte_toolkits_site->users_file_area_short . $row_play['template_id'] . "-" . $row_play['username'] . "-" . $row_play['template_name'] . "/draft/" . $file, $xerte_toolkits_site->root_file_path . $xerte_toolkits_site->users_file_area_short . $row_play['template_id'] . "-" . $row_play['username'] . "-" . $row_play['template_name'] . "/ebook/chapters/" . $file);
		
			array_push($chapters,$file);
		
		}
		
	}
	
	make_ncx($row_name['template_name'], $chapters, $xerte_toolkits_site->root_file_path . $xerte_toolkits_site->users_file_area_short . $row_play['template_id'] . "-" . $row_play['username'] . "-" . $row_play['template_name'] . "/ebook/chapters/");
	make_opf($row_name['template_name'], $chapters, $xerte_toolkits_site->root_file_path . $xerte_toolkits_site->users_file_area_short . $row_play['template_id'] . "-" . $row_play['username'] . "-" . $row_play['template_name'] . "/ebook/chapters/");
	
	Zip($xerte_toolkits_site->root_file_path . $xerte_toolkits_site->users_file_area_short . $row_play['template_id'] . "-" . $row_play['username'] . "-" . $row_play['template_name'] . "/ebook/", $xerte_toolkits_site->root_file_path . $xerte_toolkits_site->users_file_area_short . $row_play['template_id'] . "-" . $row_play['username'] . "-" . $row_play['template_name'] . "/" . $row_name['template_name'] . ".epub");

	header('Content-type: application/epub+zip');

	// It will be called downloaded.pdf
	header('Content-Disposition: attachment; filename="' . $row_name['template_name'] . '.epub"');

	// The PDF source is in original.pdf
	readfile($xerte_toolkits_site->root_file_path . $xerte_toolkits_site->users_file_area_short . $row_play['template_id'] . "-" . $row_play['username'] . "-" . $row_play['template_name'] . "/" . $row_name['template_name'] . ".epub");
	
}
