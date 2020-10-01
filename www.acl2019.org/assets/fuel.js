/**************************************************************************

 GLOBAL VARIABLES

 **************************************************************************/

var cache = [];
var dim = { ww : $(window).width() , wh : $(window).height() };
var touch = 'ontouchstart' in document.documentElement;
var googlemap = {container: "#map-canvas-contact", loaded: false};

/**************************************************************************

 GLOBAL EVENT LISTENERS FUNCTIONS

 **************************************************************************/

function ready() {
	fixedHeader();
	burgerNav('aside nav', 'left');
	$("#cfp-tabs").tabs();
	googlemap.load();
	ajaxContactForm('form#ajaxCtForm');
	/*
	$('.slick.gallery').slick({
		dots: false,
		infinite: true,
		speed: 500,
		fade: false,
		cssEase: 'linear'
	});
	*/
	if ($(document).width() > 1000) $('aside').css('min-height', $('aside nav').outerHeight());
	$(window).on('scroll resize', function(e) {
		if ($(document).width() > 1000
			&& $(window).scrollTop() >= $('.container').offset().top - $('header').height()
			&& $('.container').height() > $('aside nav').outerHeight()) {
			$('aside').css('min-height', $('aside nav').outerHeight());
			var bottom = $('footer').offset().top - $(window).scrollTop() - $(window).height();
			if ($('footer').offset().top - $(window).scrollTop() - $('header').height() < $('aside').height()) {
				$('aside nav').css({ 'position': 'fixed', 'top': '', 'bottom': -bottom, 'width': $('aside').width() });
			} else {
				$('aside nav').css({ 'position': 'fixed', 'top': $('header').height(), 'bottom': '', 'width': $('aside').width() });
			}
		} else {
			$('aside nav').css({ 'position': '', 'top': '' });
			$('aside').css('min-height', '');
		}
	});
	$('a[href^="#"]:not(.ui-tabs-anchor)').click(function (event) {
		 event.preventDefault();
		console.log('anchor link');
		 $('html, body').animate({
			  scrollTop: $($(this).attr('href')).offset().top - $('header').height()
		 }, 500);
	});
}

function load() {
	
}

function resize() {
	dim.ww = $(window).width(); dim.wh = $(window).height();
}




/**************************************************************************

CONTACT FORM AJAX

TO CHECK:
- url of ajax call
- mess_error and mess_sent text

**************************************************************************/

function ajaxContactForm(form){

	var 	$url = window.location.protocol + '//' + window.location.host + '' + window.location.pathname,
		$form = $(form),
		$result = $form.find('p.result'),
		$submit = $form.find('.submit'),
		$inputs = $('input[type="text"], input[type="date"], textarea', $form),
		$inputs_required = $form.find(':input[required=""],:input[required]'),
		mess_error = "Please check the highlighted fields.",
		mess_sent = "Your request has been sent, thank you!";

	$submit.click(function(e){
	
		e.preventDefault();
		var errors = false;	
		
		$inputs_required.each(function(){
		
			var elem = $(this);
			
			if( !elem.val() ){
				elem.addClass('error');
				errors = true;
				$result.text(mess_error).addClass('error').removeClass('success').fadeIn();
				}
				
			if( elem.attr('pattern') ){
				var re = new RegExp(elem.attr('pattern'));
				if( !re.test(elem.val()) ){
					elem.addClass('error');
					errors = true;
					$result.text(mess_error).addClass('error').removeClass('success').fadeIn();
					}
				}
		});
		
		if ( !errors ){
			$.ajax({				
				type: "POST",
				url: $url,
				dataType: "json",
				data: $form.serialize()
			})
			.done(function(error){
				if(!error){
					$result.text(mess_sent).removeClass('error').addClass('success');
					$inputs.val('').removeClass('error');
				}else{
					$result.text(mess_error).removeClass('success').addClass('error');
				}
			});			
		}
	});
	
	$inputs.focus(function(){ $(this).removeClass('error'); })
	
	
}

/**************************************************************************

 MAP

**************************************************************************/

googlemap.run = function () {
 	var address = $(googlemap.container).text();
	var map_marker_image = '/assets/map-marker.png';
	var geocoder = new google.maps.Geocoder();
	//var map_center = new google.maps.LatLng(41.943149,12.414551);
	var map_options = {
		zoom: 14,
		//center: map_center,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		zoomControl: true,
		zoomControlOptions: {
	   		style: google.maps.ZoomControlStyle.DEFAULT,
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		panControl: false,
		streetViewControl: false,
		scrollwheel: false
	};

	var style =  [
			  {
				 "featureType": "administrative",
				 "stylers": [
					{ "visibility": "simplified" }
				 ]
			  },{
				 "featureType": "landscape.natural",
				 "stylers": [
					{ "visibility": "on" },
					{ "weight": 0.1 },
					{ "lightness": 100 }
				 ]
			  },{
				 "featureType": "poi",
				 "stylers": [
					{ "visibility": "simplified" },
					{ "color": "#cccccc" }
				 ]
			  },{
				 "featureType": "road.highway",
				 "stylers": [
					{ "color": "#888888" },
					{ "visibility": "simplified" }
				 ]
			  },{
				 "featureType": "road.arterial",
				 "stylers": [
					{ "visibility": "on" },
					{ "color": "#cccccc" }
				 ]
			  },{
				 "featureType": "transit",
				 "stylers": [
					{ "visibility": "simplified" },
					{ "color": "#eeeeee" }
				 ]
			  },{
				 "featureType": "road",
				 "elementType": "labels",
				 "stylers": [
					{ "visibility": "off" }
				 ]
			  },{
			  }
			];
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var map = new google.maps.Map($(googlemap.container)[0], map_options);
			//$(googlemap.container).width(500);
			$(googlemap.container).height(400);
			map.setOptions({styles: style});				
			map.setCenter(results[0].geometry.location);			
			var marker = new google.maps.Marker({
				icon: map_marker_image,
				map: map,
				position: results[0].geometry.location
			});
			var infowindow = new google.maps.InfoWindow({
				content: '<p style="font-size: 1em"><strong>XVI CONGRESS SINS</strong><br />Via Armando Diaz, 221<br />09126 Cagliari, Italia<br /><a href="https://www.google.com/maps?ll=39.204165,9.130806&z=16&t=m&hl=it-IT&gl=IT&mapclient=embed&cid=4090255934783453449" target="_blank">Apri in Google maps</a></p>'
			});
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,marker);
			});
		}
	 });

}
googlemap.load = function () {
	if ($(googlemap.container).length > 0){
		googlemap.script = document.createElement('script');
		googlemap.script.type = 'text/javascript';
		googlemap.script.async = true;
		googlemap.script.src = "//maps.google.com/maps/api/js?V=3&sensor=false&callback=googlemap.run";
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(googlemap.script, s);
	}
};

/**************************************************************************

 BURGER NAV
 
- nav : element annidation (not as an object)
- position: left or right

 **************************************************************************/

function burgerNav(nav, position){
	
	var _nav = $(nav);
	var _burgerIcon = $('<a class="burgerIcon"><div></div></a>').prependTo(_nav);
	var _overlay = $('<div class="burgerOverlay"></div>').appendTo(_nav.parent());
	
	_burgerIcon.click(function(e){
		e.preventDefault();		
		_nav.toggleClass('active');
		_overlay.fadeToggle();
	});
	
	_overlay.click(close);
	$(window).resize(close);
	
	function close(){
		_nav.removeClass('active');
		_overlay.fadeOut();		
	}
	
	//swipe
	if(touch){
		var swipeEl = new Hammer(document.getElementsByTagName('html')[0]);
		swipeEl.on("swipeleft swiperight", function(ev) {		
				if ( 	ev.type ==  ((position == 'right') ? 'swiperight' : 'swipeleft' ) && _nav.hasClass('active')	|| ev.type == ((position == 'right') ? 'swipeleft' : 'swiperight' ) && !_nav.hasClass('active') ) 
					_burgerIcon.trigger('click')
		});
	}
}

/**************************************************************************

 FIXED HEADER

 **************************************************************************/

function fixedHeader(){

	var header = document.getElementsByTagName('header')[0];
	var nav = document.getElementsByTagName('nav')[0];
	
	function checkHolderOffset(el,offset,scroll) {
	  return scroll >= el.offsetTop + offset;
	}
	
	var handleStickyness = function() {
	  var scroll = window.scrollY;
	  if(header)  header.classList.toggle('fixed', checkHolderOffset(header, 270, scroll) );
	  nav.classList.toggle('fixed', checkHolderOffset(nav, 270, scroll) );	
	}
	
	function tryCheck() {
	 	requestAnimationFrame(handleStickyness);
	 	
	}
	
	if(window.addEventListener){
		window.addEventListener('scroll', tryCheck, false);
		window.addEventListener('resize', tryCheck, false);
	}
	
}


/**************************************************************************

 GOOGLE ANALYTICS

 **************************************************************************/

var _gaq = _gaq || [];
_gaq.push(['_setAccount','UA-42020144-15']);
_gaq.push(['_trackPageview']);
(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();


/**************************************************************************

 GLOBAL EVENT LISTENERS

 **************************************************************************/

$(document).ready(ready);
$(window).load(load);
$(window).resize(resize);
