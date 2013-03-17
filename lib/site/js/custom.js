$(document).ready(function() {

/*ios safari fix*/
    var viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]'),
        ua = navigator.userAgent,
        gestureStart = function() {
            viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
        },
        scaleFix = function() {
            if (viewportmeta && /iPhone|iPad/.test(ua) && !/Opera Mini/.test(ua)) {
                viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
                document.addEventListener("gesturestart", gestureStart, false);
            }
        };
    scaleFix();
    

/*ie7-8*/
    if ($.browser.msie) {
        if ($.browser.version == 8) $('body').addClass('ie8');
        if ($.browser.version == 7) $('body').addClass('ie7');
        if ($('body').hasClass('ie8')) {
            $('.widget_twitter ul li:last-child, table tr td:last-child, ,table th:last-child').addClass('ef-last');

            $('table th:nth-child(2n), .price-item ul li:nth-child(2n)').addClass('nth-2n');
            $('table tr:nth-child(2n+3)').addClass('nth-2n_3');
        };
        
        if ($('body').hasClass('ie7')) {
        	$('body').css({position: 'relative'}).append('<span class="ie7overlay"></span>').html('<div class="ie7message">Hello! My website requires MS Internet Explorer 8 or higher version. Please update your browser.</div>')
        }
    };
    
	var deviceAgent = navigator.userAgent.toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
    if (agentID) { 
        $('body').addClass('ef-ios');  
    }

/*Height for slider holder on start + adding preloader*/

	if ($(window).height() / $(window).width() >= 0 && $(window).height() / $(window).width() <= 0.7 && $(window).width() <= 780) {
	
    	$('.main-ctrl-container').css({height: ($(window).height() - $('.ef-head-top').height()) * 2})
    		
    	} else {
	
		$('.main-ctrl-container').css({height: $(window).height() - $('.ef-head-top').height()})
	
	}

	$('.main-ctrl-container').find('#main-slider').parent().append('<span class="slider-preloader"></span>');
	
    
/*Hovers*/
	
    $('.proj-img').has('.ef-proj-more').hover(function(){

        $(this).find('.proj-description').stop().animate({
            "opacity": "1"
        }, 400).children(':first-child').stop().animate({
        	top: '0'
        }, 200).next().stop().animate({
        	top: '0'
        }, 220).next().stop().animate({
        	bottom: '0'
        }, 200);
        
    }, function() {

        $(this).find('.proj-description').stop().animate({
            "opacity": "0"
        }, 400).children(':first-child').stop().animate({
        	top: '-40px'
        }, 200).next().stop().animate({
        	top: '-50px'
        }, 220).next().stop().animate({
        	bottom: '-75px'
        }, 200);
        
    });
    
/*Dropdown menu */
    $('ul.sf-menu').superfish({
        delay: 0,
        animation: {
            opacity: 'show'
        },
        speed: 300
    });
    $('ul.sf-menu').mobileMenu({
        defaultText: 'Navigate to...',
        className: 'ef-select-menu',
        subMenuClass: 'sub-menu',
        subMenuDash: '&ndash;'
    });
    

/*jPreloader*/
    $(".proj-img").preloader();
    
/*Portfolio filters*/

	var $container = $('#ef-portfolio');
	var efItem = $('#ef-portfolio .ef-item');
	
	if ($container.is('.ef-portfolio')) {
		
		/*Chess folter*/
		
		efItem.find('.proj-img').append('<span class="ef-cover"></span>');
			    		
	    $('ul#ef-filter a').click(function() {
	    
	        $('ul#ef-filter .p-current').removeClass('p-current');
	        $(this).parent().addClass('p-current');        
	        var filterVal = $(this).text().toLowerCase().replace(' ', '-');
	        
	        if (filterVal == 'all') {
	            $('.ef-portf-hidden').find('.ef-cover').animate({
	                "opacity": "0"
	            }).css({
	                display: "none"
	            });
	            efItem.removeClass('ef-portf-hidden').find('.ef-view').attr('rel', 'ef-group');
	            
	        } else {
	            efItem.each(function() {
	                if (!$(this).hasClass(filterVal)) {
	                    $(this).addClass('ef-portf-hidden').find('.ef-cover').css({
	                        display: "block"
	                    }).animate({
	                        "opacity": "0.95"
	                    }, 'slow');
	                    
	                    $(this).find('.ef-view').removeAttr('rel');
	                    
	                } else {
	                    $(this).removeClass('ef-portf-hidden').find('.ef-cover').animate({
	                        "opacity": "0"
	                    }).css({
	                        display: "none"
	                    });
	                    
	                    $(this).find('.ef-view').attr('rel', 'ef-group');
	                }
	            });
	        }
	        return false;
	    });
		
	} else {
	
		/*Izotope filter*/
		
		$(window).smartresize(function(){
		  
			var itemWdt = $container.width() / 4;		  
			$('.ef-width2').css({width: itemWdt * 2});
		  
			$container.isotope({
				itemSelector : efItem,
				masonry: { columnWidth: itemWdt }
			});
		  
		});
		
		
		var $optionSets = $('.option-set'),
		    $optionLinks = $optionSets.find('a');
		
		$optionLinks.click(function(){
		  var $this = $(this);
		  // don't proceed if already selected
		  if ( $this.parent().hasClass('p-current') ) {
		    return false;
		  }
		  var $optionSet = $this.parents('.option-set');
		  $optionSet.find('.p-current').removeClass('p-current');
		  $this.parent().addClass('p-current');
		
		  // make option object dynamically, i.e. { filter: '.my-filter-class' }
		  var options = {},
		      key = $optionSet.attr('data-option-key'),
		      value = $this.attr('data-option-value');
		  // parse 'false' as false boolean
		  value = value === 'false' ? false : value;
		  options[ key ] = value;
		  if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
		    // changes in layout modes need extra logic
		    changeLayoutMode( $this, options )
		  } else {
		    // otherwise, apply new options
		    $container.isotope( options );
		  }
		  
		  return false;
		});
	}

/*jFlickfeed*/
    $('.jflickr').jflickrfeed({
        limit: 8,
        qstrings: {
            id: '51035555243@N01'
        },
        itemTemplate: '<li>' + '<a href="{{image}}" title="{{title}}">' + '<img src="{{image_s}}" alt="{{title}}" />' + '<span></span>' + '</a>' + '</li>'
    }, function(data) {
    
    });
    
    
/*jTweet*/
    $(".ef-tweet").tweet({
        count: 3,
        avatar_size: 32,
        username: "evgenyfireform",
        loading_text: "Loading tweets",
        refresh_interval: 60
    }).bind("loaded", function() {
        $(this).find("a").attr("target", "_blank");
    });
    
    $(".ef-tweet-module").tweet({
        count: 1,
        avatar_size: 50,
        username: "evgenyfireform",
        loading_text: "Loading tweets",
        refresh_interval: 60
    }).bind("loaded", function() {
        $(this).find("a").attr("target", "_blank");
    });
    
    
/*Tabs*/
    $('.ef-tabs').tabs({
        fx: {
            opacity: 'show'
        },
        selected: 0
    });
    

/*Toggle box*/
    $('.ef-toggle-box').addClass('toggle-icn');
    $('.ef-toggle-box .toggle-content').css("display", "none");
    $('.ef-toggle-box li:first-child').addClass('open').find('.toggle-content').css("display", "block");
    $('.ef-toggle-box .toggle-head').click(function() {
        $(this).next('.toggle-content').toggle('blind', 200);
        $(this).parent().toggleClass('open');
    });
    
    
/*ScrollToTop and Scroll to contant*/
    jQuery.fn.topLink = function(settings) {
        settings = jQuery.extend({
            min: 1,
            fadeSpeed: 200,
            ieOffset: 50
        }, settings);
        return this.each(function() {
        
        	$(window).resize(function() {
        	    var footHt = $('.ef-copyrignts').height();
        	    var marg = ($(window).width() - $('.ef-full-grid').width()) / 2 - (el.width());
        	    el.css({bottom: footHt, right: marg});
        	});
        
            var el = $(this);
            $(window).scroll(function() {
                if (!jQuery.support.hrefNormalized) {
                    el.css({
                        'position': 'absolute',
                        'top': $(window).scrollTop() + $(window).height() - settings.ieOffset
                    });
                }
                
                if ($(window).scrollTop() >= settings.min) {
                    el.fadeIn(settings.fadeSpeed);
                } else {
                    el.fadeOut(settings.fadeSpeed);
                }
            });
        });
    };
    $('a.totop').topLink({
        min: 50,
        fadeSpeed: 500
    });
    $('a.totop').click(function(e) {
        e.preventDefault();
        $.scrollTo(0, 800);
    });
    
    $('#ef-to-content').click(function(e) {
        e.preventDefault();
        $.scrollTo($(this), 800);
    });

    
/*Accordeon*/
    $(".accordion").accordion({
        autoHeight: false,
        navigation: true
    });
    
    
/*footer*/
    var expand = $('.ef-expandable');
    
    $('a.ef-open-close').addClass("ef-close");
    
    $('a.ef-open-close').click(function() {
        if (expand.is(":visible")) {
            expand.slideUp(500, 'easeInOutExpo');
            $(this).addClass("ef-close");
            $('.totop').animate({marginRight: '0'});
        } else {
            expand.slideDown(500, 'easeInOutExpo');
            $(this).removeClass("ef-close");
            $('.totop').animate({marginRight: $('.totop').width()});
        };
        return false;
    });

/*Grid blog*/    
    $(window).smartresize(function(){
      	var blogList = $('#ef-bloglist');
      	var blogItem = $('.ef-blog-post');
      	      
    	blogList.isotope({
    		itemSelector : blogItem,
    		sortBy: 'original-order'
    	});
      
    });
    
/*Vimeo*/
    $(".proj-img").fitVids();
    
    
/*goMap*/
    $(".ef-map").goMap({
		maptype:"ROADMAP",
		address: 'Baranovichi, Belarus',	/*Center map by address*/
		zoom: 3, 							/*Default Zoom level*/
		scaleControl: true,
		navigationControl: true, 
        scrollwheel: false, 
        mapTypeControl: true,
        mapTypeControlOptions: { 
            position: 'RIGHT', 
            style: 'DROPDOWN_MENU' 
        },
        markers: [{  
            latitude: 53.12112,
            longitude: 25.98335, 
            html: { 
                content: 'First office', 
                popup: false 
            }
        },{  
            latitude: 61.52401, 
            longitude: 105.31876, 
            html: 'Second office', 
            popup: false 
            
        },{  
            latitude: 60.12816, 
            longitude: 18.64350, 
            html: 'Third office', 
            popup: false
        }],
        
        hideByClick: true,
        icon: 'images/home.png', 
        addMarker: false
        /* Other plugin options see here: http://www.pittss.lv/jquery/gomap/examples.php */
    });
    
/*Skill graphs*/
	$('.ef-progress-bar div').each(function() {		
		var pc = $(this).attr('data-id') + '%';
		$(this).append('<span><span></span></span>')
		$(this).children().children().html(pc);
		$(this).children().animate({ 'width' : pc }, 1500, 'easeOutBounce');		
	});
	
/*Alerts*/	
	$('.ef-alertBox, .ef-list').append('<span></span>');	
	$('.ef-alertBox span, .ef-list span').click(function() {
		$(this).parent().fadeOut(500);
	});
	
/*Footer to bottom*/
	function changeHeight() {
		$('#ef-content').css('min-height', '');
		var sigma = $(window).height() - $('body').height();
		if (sigma > 0) $('#ef-content').css('min-height', $('#ef-content').height() + sigma - $('html').offset().top);
	}
	
	function SGaddEvent( obj, type, fn ){
		if (obj.addEventListener){obj.addEventListener( type, fn, false );}
		else if (obj.attachEvent){
		obj["e"+type+fn] = fn;obj[type+fn] = function(){obj["e"+type+fn]( window.event );}
		obj.attachEvent( "on"+type, obj[type+fn] );}
	}
	SGaddEvent(window, 'load', changeHeight);
	SGaddEvent(window, 'resize', changeHeight);
	
	
/*Fixed menu*/

	var head = $('.ef-head-top');
	var menu = $('.ef-menu-wrapper');
	var headMenu = menu.height() + head.children(':first-child').height();	
		
	$(window).resize(function() {
		head.css({height: 'auto'});
		
		if ($(window).scrollTop() > head.height()){
			menu.removeClass('ef-default').addClass('ef-fixed');			
		} else {
			menu.removeClass('ef-fixed').addClass('ef-default');
		}
				
	});
	
	$(window).scroll(function(){		
		pos = head.offset();
		head.css({height: headMenu});
		
		if ($('body').hasClass('.ef-ios') || $(window).width() <= 1066) {

		} else {
			
			if($(this).scrollTop() > pos.top+head.height() && menu.hasClass('ef-default')){
				menu.slideUp('fast', function(){
					$(this).removeClass('ef-default').addClass('ef-fixed').slideDown('fast');
				});
				
			} else if($(this).scrollTop() <= pos.top+head.height() && menu.hasClass('ef-fixed')){
				menu.slideUp('fast', function(){
					$(this).removeClass('ef-fixed').addClass('ef-default').slideDown('fast');
				});
			}

		}
	});		
	
});

/*Window onload*/

$(window).load(function() {


/*Align height*/

    $(".ef-extras > .ef-col1-4, .ef-extras > .ef-col").equalHeight();


/*Main homepage slider*/
	
    $('#main-slider').flexslider({

        controlsContainer: ".main-ctrl-container",
        animationSpeed: 500,
        slideshow: false, /* set 'true' if you want auto scrolling */
        animation: "slide", /*do not modify animation style*/
        easing: "swing", /* http://jqueryui.com/demos/effect/easing.html */
        controlNav: false, /* set 'true' to show slider pagination */
        directionNav: true, /* set 'false' to hide slider Arrows */
        start: function(slider) {
			$('.slider-preloader').remove();
						
			slider			
			.fadeIn()
			
			/*Calculate slider middle position*/
			
			.css({top: ( $('.main-ctrl-container').height() - $('.flex-viewport').height() ) / 2 })
			
			.parent().find('a.flex-prev')
			.delay(500)
			.animate({marginLeft: '2em'});
			
			slider.parent().find('a.flex-next')
			.delay(500)
			.animate({marginRight: '2em'});
			
			
			/*Calculate slider content middle position*/
			
			var flexViewport = $('.flex-viewport').height();
			var slideContent = $('.ef-slide-content');
			slideContent.each(function() {
				$(this)
				.css({ marginTop: (flexViewport - $(this).height()) / 2, marginBottom: (flexViewport - $(this).height()) / 2 })
				
				/*Calculate caption middle position*/
				
				.find('.flex-caption').each(function(){
					$(this).css({top: ($(this).parent().height() - $(this).height()) / 2})
				})
				
			});
			
			/*Caption animations*/
						
			$('.flex-caption').delay(100).fadeIn(500)		
        },
        
        before: function(slider) {
        	var flexViewport = $('.flex-viewport').height();
        	var slideContent = $('.ef-slide-content');
        	
        	var $animatingTo = slider.slides.eq(slider.animatingTo);
        	
        	$animatingTo.find('.ef-slide-content').each(function() {
        		$(this)
        		.css({ marginTop: ($('.flex-viewport').height() - $(this).height()) / 2, marginBottom: ($('.flex-viewport').height() - $(this).height()) / 2 });
        		});
        
        	$('.flex-caption').delay(100).css({display: 'none'})
        	
        },
        
        after: function(slider) {
        	
        	/*Caption animation*/
        
        	$('.flex-caption').delay(100).fadeIn(500)
        	
        }
    });
	
/*Some slider customizations on window resize*/

    $(window).resize(function() {
    	var sliderHeight = $(window).height() - $('.ef-head-top').height();
    	var flexViewport = $('.flex-viewport').height();    	
    	
    	
    	if ($(window).height() / $(window).width() >= 0 && $(window).height() / $(window).width() <= 0.7 && $(window).width() <= 780) {
    	
		var sliderHeight = ($(window).height() - $('.ef-head-top').height()) * 2;		
    	$('.main-ctrl-container').css({height: sliderHeight});
    	    		
    	} else {
    		$('.main-ctrl-container').css({height: sliderHeight});
    	}
    	
    	$('.ef-slide-content').each(function() {
    		$(this).css({marginTop: (flexViewport - $(this).height()) / 2, marginBottom: (flexViewport - $(this).height()) / 2 })
    		
    		.find('.flex-caption').each(function(){
				$(this).css({top: ($(this).parent().height() - $(this).height()) / 2})
			})
		});
		    	
    	$('#main-slider').css({top: ( sliderHeight - $('.flex-viewport').height() ) / 2});
    	
    });   

   
/*Post slider*/
    $('.ef-post-slider').flexslider({
        slideshow: false, /* set 'true' if you want auto scrolling */
        animation: "fade", /* 'slide' or 'fade' animation style */
        controlNav: true, /* set 'false' to hide slider pagination */
        directionNav: false /*Set 'true' to enable nav arrows*/
    });
    
    $('.ef-blog-post, .ef-post-slider').hover(function() {    
        $(this).find('.flex-control-paging').stop().animate({
        	bottom: '0'
        }, 200);
        
        $(this).find('.flex-direction-nav a').stop().animate({
        	marginLeft: '0', marginRight: '0'
        }, 200);
        
    }, function() {
        $(this).find('.flex-control-paging').stop().animate({
        	bottom: '-1.2em'
        }, 200);
        
        $(this).find('.flex-direction-nav a.flex-prev').stop().animate({
        	marginLeft: '-25px'
        }, 200);
        
        $(this).find('.flex-direction-nav a.flex-next').stop().animate({
        	marginRight: '-25px'
        }, 200);
        
    });
    
/*Flickr hover*/
    $('.jflickr li a').hover(function() {
        $(this).find('span').stop().animate({
            opacity: '0.4'
        }, 100);
    }, function() {
        $(this).find('span').stop().animate({
            opacity: '0'
        }, 300);
    });
    
    if ($('#ef-portfolio').is(':not(.ef-portfolio)')) {
    	$('.ef-featured').addClass('ef-width2');
    }
    
    
/*Fixed portfolio item details*/
	var sidebar = $('#theFixed');
	
	if (typeof sidebar != 'undefined') {
		var sidebarOffset = sidebar.offset().top - 100;
		var windowHeight = $(window).height() -100;

		$(window).scroll(function(){		
			var sidebarHeight = sidebar.height() - 100;
			var thumbsHeight = $('.ef-proj-thumbs').height();
			var bottomFix = thumbsHeight - sidebarHeight;		
			var scrollVal = $(window).scrollTop();
			
			if(thumbsHeight > sidebarHeight && scrollVal > sidebarOffset && sidebarHeight + 100 <= windowHeight){
				sidebar.css({position: 'fixed', top: '100px'});
				if(scrollVal - sidebarOffset >= bottomFix - 100){
					sidebar.css({position: 'absolute', top: bottomFix - 100});
				}
			}else{
				sidebar.css({position: 'static', top: '0'});
			}
		});
	}


});