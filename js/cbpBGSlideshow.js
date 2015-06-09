/**
 * cbpBGSlideshow.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpBGSlideshow = (function() {

	var $slideshow = $( '#cbp-bislideshow' ),
		$items = $slideshow.children( 'li' ),
  		itemsCount = $items.length,
               $yt_videos = {},
               // Dejar este valor en cero para reproducir la totalidad del video
               $video_timeout = 0,
		$controls = $( '#cbp-bicontrols' ),
		navigation = {
			$navPrev : $controls.find( 'span.cbp-biprev' ),
			$navNext : $controls.find( 'span.cbp-binext' ),
			$navPlayPause : $controls.find( 'span.cbp-bipause' )
		},
		// current item´s index
		current = 0,
		// timeout
		slideshowtime,
		// true if the slideshow is active
		isSlideshowActive = true,
		// it takes 3.5 seconds to change the background image
		interval = 500;

	function init( config ) {

		// preload the images
		$slideshow.imagesLoaded( function() {
			
			if( Modernizr.backgroundsize ) {
				$items.each( function() {
					var $item = $( this );
					$item.css( 'background-image', 'url(' + $item.find( 'img' ).attr( 'src' ) + ')' );
				} );
			}
			else {
				$slideshow.find( 'img' ).show();
				// for older browsers add fallback here (image size and centering)
			}
			// show first item
			$items.eq( current ).css( 'opacity', 1 );
			// initialize/bind the events
			initEvents();
			// start the slideshow
			startSlideshow();

		} );
		
	}

	function initEvents() {

		navigation.$navPlayPause.on( 'click', function() {

			var $control = $( this );
			if( $control.hasClass( 'cbp-biplay' ) ) {
				$control.removeClass( 'cbp-biplay' ).addClass( 'cbp-bipause' );
				startSlideshow();
			}
			else {
				$control.removeClass( 'cbp-bipause' ).addClass( 'cbp-biplay' );
				stopSlideshow();
			}

		} );

		navigation.$navPrev.on( 'click', function() { 
		        pararTodos();
			navigate( 'prev' ); 
			if( isSlideshowActive ) { 
				startSlideshow(); 
			} 
		} );
		navigation.$navNext.on( 'click', function() { 
		        pararTodos();
			navigate( 'next' ); 
			if( isSlideshowActive ) { 
				startSlideshow(); 
			}
		} );

	}

	function navigate( direction ) {

		// current item
		var $oldItem = $items.eq( current );
		
		if( direction === 'next' ) {
			current = current < itemsCount - 1 ? ++current : 0;
		}
		else if( direction === 'prev' ) {
			current = current > 0 ? --current : itemsCount - 1;
		}

		// new item
		var $newItem = $items.eq( current );
		// show / hide items
		$oldItem.css( 'opacity', 0 );
		$newItem.css( 'opacity', 1 );

	}

	function startSlideshow() {

		isSlideshowActive = true;
		clearTimeout( slideshowtime );
		slideshowtime = setTimeout( function() {

		element = $items.eq(current);

               // Agrega la validación para detectar si se ha definido
		// un slide contenedor de video de youtube a partir de la 
		// clase .video
		        if (element.hasClass('video')) {
			    // dispara el evento click sobre el elemento
			    // de navegación para detener o continuar 
			    // la reproducción de slides
			    navigation.$navPlayPause.trigger("click");

			    // Id del video de youtube definido en el HTML
			    vId = element.data('video-id');
			    playerId = vId

			    incrustarVideo(element, vId, playerId, autoPlay = 1)
			
			} else {

			    navigate( 'next' );
			    startSlideshow();

			}
		}, interval );

	}

	function stopSlideshow() {
		isSlideshowActive = false;
		clearTimeout( slideshowtime );
	}

        function pararTodos() {
	    if (!jQuery.isEmptyObject($yt_videos)) {
		for(video in $yt_videos) {
		    $yt_videos[playerId].stopVideo();		
		}
	    }
	}


	/**
	* función incrustarVideo
	* 
	* Detiene la ejecución del slideshow si el slide contiene
	* algun video de youtube definido a partir de la clase .video
	* y el atributo data-video-id desde el HTML
	*
	* Hace uso de la iframe_api de youtube para iniciar o detener
	* la ejecución del video en el momento que el slide lo presenta
	*
	* @param el Object el actual slide que contiene el video
	* @param vId String Id video de youtube
	* @param playerId String Id del elemento donde se cargará el player
	* @param autoPlay Boolean el video se ejecutará automaticamente. default = true 
	* 
	*/
       function incrustarVideo(el, vId, playerId, autoPlay) {

	    function iniciarVideo() {
		$yt_videos[playerId].seekTo(0);
		$yt_videos[playerId].playVideo();

		$controls.find(".cbp-biplay").removeClass('cbp-biplay').addClass('cbp-bipause');
	    }

	    function pararVideo() {
		$yt_videos[playerId].stopVideo();

		$controls.find(".cbp-biplay").removeClass('cbp-biplay').addClass('cbp-bipause');
		navigate( 'next' );
		startSlideshow();
	    }
	    
	    function onPlayerReady(event) {
		event.target.playVideo();
	    }
	    
	    var done = false;
	    function onPlayerStateChange(event) {
		if($video_timeout != 0) {
		    
		    if (event.data == YT.PlayerState.PLAYING && !done) {
			setTimeout(pararVideo, $video_timeout);
			done = true;
		    }
		} else {
		    if (event.data == YT.PlayerState.ENDED) {
			pararVideo();
			done = true;
		    }
		}
		
	    }
	    
	    if (!(typeof $yt_videos[playerId] === "object")) {

		el.append('<div id="'+playerId+'"></div>');
		
		$yt_videos[playerId] = new YT.Player(playerId, {
		    width: '430',
		    height: '241',
		    videoId: vId,
		    playerVars: {'autoplay': autoPlay, 'controls':1},
		    events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		    }
		});
		
	    } else {
		iniciarVideo();
	    } 
	}
    
    return { init : init };
    
})();
