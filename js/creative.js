/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function($) {
	"use strict"; // Start of use strict

	if ('orientation' in window) {
		$('body').addClass('mobile');
	}

	var navHeight = $('.navbar-header').height();

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$('a.page-scroll').bind('click', function(event) {
		var $anchor = $(this);
		var pos = $($anchor.attr('href')).offset().top;
		$('html, body').stop().animate({
			scrollTop: pos - navHeight
		}, 1250, 'easeInOutExpo');
		event.preventDefault();
	});

	// Highlight the top nav as scrolling occurs
	$('body').scrollspy({
		target: '.navbar-fixed-top',
		offset: navHeight + 1
	});

	// Closes the Responsive Menu on Menu Item Click
	$('.navbar-collapse ul li a').click(function() {
		$('.navbar-toggle:visible').click();
	});

	// Fit Text Plugin for Main Header
	$("h1").fitText(
		1.2, {
			minFontSize: '35px',
			maxFontSize: '55px'
		}
	);

	// Offset for Main Navigation
	$('#mainNav').affix({
		offset: {
			top: 100
		}
	});

	// Initialize WOW.js Scrolling Animations
	new WOW().init();

	$('#faq a').click(function(e) {
		var a = $(this);
		var dest = $(this.hash);
		a.closest('ul').find('a').removeClass('active');
		a.addClass('active');
		dest.removeClass('hidden').siblings().addClass('hidden');
		return false;
	});

	// Generic fade slideshow

	function step(parent, dir) {
		var items = parent.find('.fade-item');
		var i = items.index(items.filter('.show'));
		items.removeClass('show');
		items.eq((i + items.length + dir) % items.length).addClass('show');
	}

	// Header images

	setInterval(function() {
		step($('header'), 1);
	}, 3000);

	// Modal slideshows

	$('.modal .images').find('.prev,.next').click(function() {
		var btn = $(this);
		step(btn.parent(), btn.hasClass('prev') ? -1 : 1);
	});

	// MAP

	var config = {
		center: {lat:-34.47230615, lon:-58.506021},
		zoom: 15,
		clickZoom: 17,
		icons: {
			width: 28,
			height: 31
		},
		markers: [
			{lat:-34.4778335, lon:-58.5024091, address:'Lugar 1', tel:'1234567', web:'http://lugar1.com', logo:'cuber-logo.jpg',promo:'jkl.jpg'}
			,{lat:-34.4778335, lon:-58.5024091, address:'Lugar 2', tel:'1234567', web:'http://lugar2.com', logo:'cuber-logo.jpg',promo:'jkl.jpg'}
			,{lat:-34.4667788, lon:-58.5096329, address:'Lugar 3', tel:'1234567', web:'http://lugar3.com', logo:'cuber-logo.jpg',promo:'jkl.jpg'}
		]
	};

	// CHECK WINDOW RESIZE
	var is_windowresize = false;
	$(window).resize(function() {
		is_windowresize = true;
	});


	function latlng(obj) {
		return new google.maps.LatLng(obj.lat || obj.latitude, obj.lon || obj.longitude);
	}

	var map;

	//INITIALIZE MAP
	function initialize() {

		//DEFINE MAP OPTIONS
		//=======================================================================================
		var mapOptions = {
			zoom: config.zoom,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: latlng(config.center),
			panControl: true,
			zoomControl: true,
			mapTypeControl: true,
			//scaleControl: false,
			streetViewControl: true,
			overviewMapControl: true,
			//rotateControl:true,

		};

		//CREATE NEW MAP
		//=======================================================================================
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		//MARKER ICON
		//=======================================================================================
		//var image = 'facebook30.svg';

		//ADD NEW MARKER
		//=======================================================================================
		/*var marker = new google.maps.Marker({
			position: map.getCenter(),
			map: map,
			title: 'Click to zoom',
			icon: image
		});
		
		var marker1 = new google.maps.Marker({
			position: new google.maps.LatLng(-34.477781, -58.5045055),
			map: map,
			title: 'Click to zoom'
		});*/


		//ADD NEW MARKER WITH LABEL
		//=======================================================================================

		var markers = config.markers.map(function(obj) {
			var pos = latlng(obj);
			var icons = config.icons;
			var marker = new MarkerWithLabel({
				position: pos,
				draggable: false,
				raiseOnDrag: false,
				icon: ' ',
				map: map,
				labelContent: '<div class="map-icon" style="width:'+icons.width+'px;height:'+icons.height+'px"></div>',
				labelAnchor: new google.maps.Point(icons.width/2, icons.height/2),
				labelClass: "labels" // the CSS class for the label
			});
			marker.info = new google.maps.InfoWindow({
				content: '<div class="info">'+
					'<div class="logo" style="background-image: url(/img/logos/'+obj.logo+')"></div>'+
					'<p>Dirección: '+obj.address+
					'<br/>Teléfono: '+obj.tel+
					'<br/>Web: <a href="'+obj.web+'" target="_blank">'+obj.web+'</a>'+
					'<br/><a class="promo" href="/img/promos/'+obj.promo+'" target="_blank">Ver PROMO</a></p>'+
				'</div>'
			});
			google.maps.event.addListener(marker, 'click', function() {
				markers.forEach(function(m) { m.info.close(); });
				map.setZoom(config.clickZoom);
				map.setCenter(pos);
				marker.info.open(map, marker);
			});
			return marker;
		});

		//ON BOUND EVENTS AND WINDOW RESIZE
		//=======================================================================================

		//var center = new google.maps.LatLng(-34.4725169, -58.51261655);
		var center = new google.maps.LatLngBounds(markers[0].getPosition());
		markers.forEach(function(m) {
			center = center.extend(m.getPosition());
		});

		map.panToBounds(center);

		google.maps.event.addListener(map, 'bounds_changed', function() {
			if (is_windowresize) {
				//map.setCenter(marker.getPosition());
				window.setTimeout(function() {
					map.panToBounds(center);
				}, 500);
			}
			is_windowresize = false;
		});
	}

	// LOAD GMAP
	google.maps.event.addDomListener(window, 'load', initialize);

	// FORM

	$('form').submit(function(e) {
		var thx = $('#thanks');
		if (thx.is(':visible')) {
			e.preventDefault();
		} else {
			thx.show();
		}
	});

	// Auto location

	if (navigator.geolocation) {
		var win = $(window).scroll(function(e) {
			if (win.scrollTop() + win.innerHeight() >= $('#mapa').offset().top) {
				win.unbind('scroll');
        navigator.geolocation.getCurrentPosition(function(res) {
        	var pos = latlng(res.coords);
      		map.setZoom(config.clickZoom);
					map.setCenter(pos);

					var icons = config.icons;
					new MarkerWithLabel({
						position: pos,
						draggable: false,
						raiseOnDrag: false,
						icon: ' ',
						map: map,
						labelContent: '<span class="glyphicon glyphicon-map-marker" style="width:'+icons.width+'px;height:'+icons.height+'px"></span>',
						labelAnchor: new google.maps.Point(icons.width/2, icons.height/2)
					});
        });
			}
		});
		win.scroll();
	}

	//https://maps.googleapis.com/maps/api/geocode/json?address=xxx&language=es&region=ar

})(jQuery); // End of use strict

