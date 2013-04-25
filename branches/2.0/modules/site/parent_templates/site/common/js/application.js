
$(document).ready(init);

var data;

function init(){	

	loadContent();
};

function initMedia(){

	$('audio,video').mediaelementplayer();
}

function initSidebar(){
	var $window = $(window)
	
	//TOC
	$('.bs-docs-sidenav').affix
	(
		{
			offset: 
			{
				top: function () { return $window.width() <= 980 ? 290 : 210 },
				bottom: 270
			}
		}
	)
}

function loadContent(){

	$.ajax({
	
		type: "GET",
		url: projectXML,
		dataType: "xml", 
		success: function(xml) {
		
			if (typeof data == 'string'){
			
				//in IE we need to turn the string into xml
				data = $.parseXML(xml);
				
			} else {
			
				data = xml;
				
			}
			
			//add all the pages to the pages menu: this links bak to the same page
			$(data).find('page').each( function(index, value){
			
				$('#nav').append('<li class=""><a href="javascript:parseContent(' + index + ')">' + $(this).attr('name') + '</a></li>');
				
			});
			
			//set the header image, if defined
			if ($(data).find('learningObject').attr('header') != undefined){
			
				$('#overview').css({filter:''}); //for IE8
				
				$('#overview').css('background-image', "url(" + eval( $(data).find('learningObject').attr('header'))+ ")");
			} 
			
			if ($(data).find('learningObject').attr('headerColour') != undefined){
			
				var col = $(data).find('learningObject').attr('headerColour');
				
				//one or two?
				if (col.substr(',') != -1){
					col = col.split(',');
				} else {
					col = [col,col];
				}
				
				$('#overview').css('background', col[0]);
				$('#overview').css('background', '-moz-linear-gradient(45deg,  ' + col[0] + ' 0%, ' + col[1] + ' 100%)');
				$('#overview').css('background', '-webkit-gradient(linear, left bottom, right top, color-stop(0%,' + col[0] + '), color-stop(100%,' + col[1] + '))');
				$('#overview').css('background', '-webkit-linear-gradient(45deg,  ' + col[0] + ' 0%,' + col[1] + ' 100%)');
				$('#overview').css('background', '-o-linear-gradient(45deg,  ' + col[0] + ' 0%,' + col[1] + ' 100%)');
				$('#overview').css('background', '-ms-linear-gradient(45deg,  ' + col[0] + ' 0%,' + col[1] + ' 100%)');
				$('#overview').css('background', 'linear-gradient(45deg,  ' + + ' 0%,' + col[1]+ ' 100%)');
				$('#overview').css('filter', 'progid:DXImageTransform.Microsoft.gradient( startColorstr=' + col[0] + ', endColorstr=' + col[1] + ',GradientType=1 )');
				
			}
			
			if ($(data).find('learningObject').attr('headerTextColour') != undefined){
			
				$('#overview').css('color', $(data).find('learningObject').attr('headerTextColour'));
				
			}
			
			//done with one time stuff, now parse the first page...
			parseContent(0);
		}
		
	});
	
}

function parseContent(index){

	//clear out existing content
	$('#mainContent').empty();
	$('#toc').empty();

	//which page is this from the document?
	var page = $(data).find('page').eq(index);
	
	//set the main page title and subtitle			
	$('#pageTitle').text( page.attr('name') );
	$('#pageSubTitle').text( page.attr('subtitle') );
	
	
	//create the sections
	page.find('section').each( function(index, value){
	
		var sectionIndex = index;	
				
		//add a TOC entry
		$('#toc').append('<li><a href="#section' + index + '">' + $(this).attr('name') + '</a></li>');
		
		//add the section header
		var section = $('<section id="section' + index + '"><div class="page-header"><h1>' + $(this).attr('name') + '</h1></div></section>');

		//add the section contents
		$(this).children().each( function(index, value){
		
			var itemIndex = index;
		
			if (this.nodeName == 'text'){
				section.append( '<p>' + $(this).text() + '</p>');
			}
			
			if (this.nodeName == 'script'){
				section.append( '<script>' + $(this).text() + '</script>');
			}
			
			if (this.nodeName == 'image'){
				section.append('<p><img class="img-polaroid" src="' + eval( $(this).attr('url')) + '" title="' + $(this).attr('alt') + '" alt="' + $(this).attr('alt') + '"/></p>');
			}
			
			if (this.nodeName == 'audio'){
				section.append('<p><b>' + $(this).attr('name') + '</b></p><p><audio src="' + eval( $(this).attr('url') ) + '" type="video/mp4" id="player1" controls="controls" preload="none" width="100%"></audio></p>')
			}
			
			if (this.nodeName == 'video'){
				section.append('<p><b>' + $(this).attr('name') + '</b></p><p><video style="max-width: 100%" class="fullPageVideo" src="' + eval( $(this).attr('url') ) + '" type="video/mp4" id="player1" controls="controls" preload="none"></video></p>');
			}
			
			if (this.nodeName == 'navigator'){
			
				if ($(this).attr('type') == 'Tabs'){
					makeNav( $(this), section, 'tabs', sectionIndex, itemIndex );
				}
				
				if ($(this).attr('type') == 'Accordion'){
					makeAccordion( $(this), section, sectionIndex, itemIndex );
				}
				
				if ($(this).attr('type') == 'Pills'){
					makeNav( $(this), section, 'pills', sectionIndex, itemIndex);
				}
				
				if ($(this).attr('type') == 'Carousel'){
					makeCarousel(  $(this), section, sectionIndex, itemIndex );
				}
			}

		});
		
		//a return to top button
		section.append( $('<p><br><a class="btn btn-mini pull-right" href="#">Top</a></p>'));

		//add the section to the document
		$('#mainContent').append(section);
					
	});
	
	//finish initialising the piece now we have the content loaded
	initMedia();
	
	initSidebar();
	
	window.scroll(0,0);
	
	//$('body').scrollSpy('refresh'); //seems to cause a bunch of errors with tabs
	$('#toc a:first').tab('show');
	
	//an event for user defined code to know when loading is done
	$(document).trigger('contentLoaded');
	
	//force facebook / twitter objects to initialise
	twttr.widgets.load();
	
	FB.XFBML.parse(); 
	
	
}

function makeNav(node,section,type, sectionIndex, itemIndex){

	var sectionIndex = sectionIndex;
	
	var itemIndex = itemIndex;

	var tabDiv = $( '<div class="tabbable"/>' );
	
	if (type == 'tabs'){
	
		var tabs = $( '<ul class="nav nav-tabs" id="tab' + sectionIndex + '_' + itemIndex + '"/>' );
		
	}
	
	if (type == 'pills'){
	
		var tabs = $( '<ul class="nav nav-pills" id="tab' + sectionIndex + '_' + itemIndex + '"/>' );
	}
		
	var content = $( '<div class="tab-content"/>' );
	
	
	node.children().each( function(index, value){
	
		if (index == 0){

			tabs.append( $('<li class="active"><a href="#tab' + sectionIndex + '_' + itemIndex + '_' + index + '" data-toggle="tab">' + $(this).attr('name') + '</a></li>') );
			
			var tab = $('<div id="tab' + sectionIndex + '_' + itemIndex + '_' + index + '" class="tab-pane active"/>')
			
		} else {
		
			tabs.append( $('<li><a href="#tab' + sectionIndex + '_' + itemIndex + '_' + index + '" data-toggle="tab">' + $(this).attr('name') + '</a></li>') );
			
			var tab = $('<div id="tab' + sectionIndex + '_' + itemIndex + '_' + index + '" class="tab-pane"/>')
			
		}
		
		$(this).children().each( function(index, value){
				
		
			if (this.nodeName == 'text'){
				tab.append( '<p>' + $(this).text() + '</p>');
			}
			
			if (this.nodeName == 'image'){
				tab.append('<p><img class="img-polaroid" src="' + eval( $(this).attr('url')) + '" title="' + $(this).attr('alt') + '" alt="' + $(this).attr('alt') + '"/></p>');
			}

			if (this.nodeName == 'audio'){
				tab.append('<p><b>' + $(this).attr('name') + '</b></p><p><audio src="' + eval( $(this).attr('url') ) + '" type="video/mp4" id="player1" controls="controls" preload="none" width="100%"></audio></p>')
			}
			
			if (this.nodeName == 'video'){
				tab.append('<p><b>' + $(this).attr('name') + '</b></p><p><video style="max-width: 100%" class="fullPageVideo" src="' + eval( $(this).attr('url') ) + '" type="video/mp4" id="player1" controls="controls" preload="none"></video></p>');
			}
			
		});
		
		content.append(tab);
	});
	
	tabDiv.append(tabs);
	
	tabDiv.append(content);
	
	section.append(tabDiv);
	
	setTimeout( function(){ $('#tab' + sectionIndex + '_' + itemIndex + ' a:first').tab('show'); }, 0);
	
}

function makeAccordion(node,section, sectionIndex, itemIndex){

	var accDiv = $( '<div class="accordion" id="acc' + sectionIndex + '_' + itemIndex + '">' );
	
	node.children().each( function(index, value){

		var group = $('<div class="accordion-group"/>');
		
		var header = $('<div class="accordion-heading"><a class="accordion-toggle" data-toggle="collapse" data-parent="#acc' + sectionIndex + '_' + itemIndex + '" href="#collapse' + sectionIndex + '_' + itemIndex + '_' + index + '">' + $(this).attr('name') + '</a></div>');
		
		group.append(header);
		
		if (index == 0){
		
			var outer = $('<div id="collapse' + sectionIndex + '_' + itemIndex + '_' + index + '" class="accordion-body collapse in"/>');
			
		} else {
		
			var outer = $('<div id="collapse' + sectionIndex + '_' + itemIndex + '_' + index + '" class="accordion-body collapse"/>');
			
		}
		
		
		var inner = $('<div class="accordion-inner">');
		
		$(this).children().each( function(index, value){
						
			if (this.nodeName == 'text'){
				inner.append( '<p>' + $(this).text() + '</p>');
			}
			
			if (this.nodeName == 'image'){
				inner.append('<p><img class="img-polaroid" src="' + eval( $(this).attr('url')) + '" title="' + $(this).attr('alt') + '" alt="' + $(this).attr('alt') + '"/></p>');
			}

			if (this.nodeName == 'audio'){
				inner.append('<p><b>' + $(this).attr('name') + '</b></p><p><audio src="' + eval( $(this).attr('url') ) + '" type="video/mp4" id="player1" controls="controls" preload="none" width="100%"></audio></p>')
			}
			
			if (this.nodeName == 'video'){
				inner.append('<p><b>' + $(this).attr('name') + '</b></p><p><video style="max-width: 100%" class="fullPageVideo" src="' + eval( $(this).attr('url') ) + '" type="video/mp4" id="player1" controls="controls" preload="none"></video></p>');
			}
		});
		
		outer.append(inner);
		
		group.append(outer);
		
		accDiv.append(group);
	});
	
	section.append(accDiv);
	
}


function makeCarousel(node, section, sectionIndex, itemIndex){

	var sectionIndex = sectionIndex;
	
	var itemIndex = itemIndex;
	
	var carDiv = $('<div id="car' + sectionIndex + '_' + itemIndex + '" class="carousel slide"/>');
	
	var indicators = $('<ol class="carousel-indicators"/>');
	
	var items = $('<div class="carousel-inner"/>');
	
	
	node.children().each( function(index, value){
	
		var pane;
	
		if (index == 0){
		
			indicators.append( $('<li data-target="#car' + sectionIndex + '_'  + itemIndex + '" data-slide-to="' + index + '" class="active"></li>') );
			
			pane = $('<div class="active item">');
			
		} else {
		
			indicators.append( $('<li data-target="#car' + sectionIndex + '_'  + itemIndex + '" data-slide-to="' + index + '"></li>') );
			
			pane = $('<div class="item">');
		}
		
		$(this).children().each( function(index, value){
						
			if (this.nodeName == 'text'){
				pane.append( '<p>' + $(this).text() + '</p>');
			}
			
			if (this.nodeName == 'image'){
				pane.append('<p><img class="img-polaroid" src="' + eval( $(this).attr('url')) + '" title="' + $(this).attr('alt') + '" alt="' + $(this).attr('alt') + '"/></p>');
			}

			if (this.nodeName == 'audio'){
				pane.append('<p><b>' + $(this).attr('name') + '</b></p><p><audio src="' + eval( $(this).attr('url') ) + '" type="video/mp4" id="player1" controls="controls" preload="none" width="100%"></audio></p>')
			}
			
			if (this.nodeName == 'video'){
				pane.append('<p><b>' + $(this).attr('name') + '</b></p><p><video style="max-width: 100%" class="fullPageVideo" src="' + eval( $(this).attr('url') ) + '" type="video/mp4" id="player1" controls="controls" preload="none"></video></p>');
			}
			
		});
		
		items.append(pane);
		
	});
	
	carDiv.append(indicators);
	
	carDiv.append(items);
	
	carDiv.append( $('<a class="carousel-control left" href="#car' + sectionIndex + '_'  + itemIndex + '" data-slide="prev">&lsaquo;</a>') );
	carDiv.append( $('<a class="carousel-control right" href="#car' + sectionIndex + '_'  + itemIndex + '" data-slide="next">&rsaquo;</a>') );
	
	section.append(carDiv);

}
























