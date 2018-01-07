var currentPageNo = 0;
var down = true;
var singlePageView = false;
var width = 925;
var display = "double";
var imageName = "/Springboard-";

function loadSelectedPage(pageNo) {
  if (!pageNo) {
    pageNo = parseInt($("#pageToGo").val());
  } else {
    pageNo = parseInt(pageNo);
  }
  $('.magazine').turn('page', pageNo);
  $("#pageNo").val("");
}

var zoomFn;

function zoomApp() {
  $('.magazine-viewport').zoom({
    flipbook: $('.magazine'),

    max: function() {
      return largeMagazineWidth() / $('.magazine').width();
    },

    when: {
      swipeLeft: function() {

        $(this).zoom('flipbook').turn('next');

      },

      swipeRight: function() {

        $(this).zoom('flipbook').turn('previous');

      },

      resize: function(event, scale, page, pageElement) {

        if (scale == 1)
          loadSmallPage(page, pageElement);
        else
          loadLargePage(page, pageElement);

      },

      zoomIn: function() {

        $('#slider-bar').hide();
        $('.made').hide();
        $('.magazine').removeClass('animated').addClass('zoom-in');
        $('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');

        if (!window.escTip && !$.isTouch) {
          escTip = true;

          $('<div />', {
            'class': 'exit-message'
          }).
          html('<div>Press ESC to exit</div>').
          appendTo($('body')).
          delay(2500).
          animate({
            opacity: 0
          }, 500, function() {
            $(this).remove();
          });
        }
      },

      zoomOut: function() {

        $('#slider-bar').fadeIn();
        $('.exit-message').hide();
        $('.made').fadeIn();
        $('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');

        setTimeout(function() {
          $('.magazine').addClass('animated').removeClass('zoom-in');
          resizeViewport();
        }, 0);

      }
    }
  });

  // Zoom event

  /*if ($.isTouch)
		$('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
	else
		$('.magazine-viewport').bind('zoom.tap', zoomTo);

*/
  // Using arrow keys to turn the page

  $(document).keydown(function(e) {

    var previous = 37,
      next = 39,
      esc = 27;

    switch (e.keyCode) {
      case previous:
        if (down) {
          down = false;
          // left arrow
          $('.magazine').turn('previous');
          e.preventDefault();
        }

        break;
      case next:

        if (down) {
          down = false;
          $('.magazine').turn('next');
          e.preventDefault();
        }

        break;
      case esc:

        $('.magazine-viewport').zoom('zoomOut');
        e.preventDefault();

        break;
    }
  });
}

function loadApp() {
  $("#loader").show();
  $('#canvas').fadeIn(1000);

  var flipbook = $('.magazine');

  if (flipbook.width() == 0 || flipbook.height() == 0) {
    setTimeout(loadApp, 1);
    return;
  }

  flipbook.turn({

    // Magazine width

    width: width,

    // Magazine height

    height: 600,

    // Duration in millisecond

    duration: 1500,

    // Enables gradients

    gradients: false,

    // Auto center this flipbook
    display: display,

    autoCenter: true,

    // Elevation from the edge of the flipbook when turning a page

    elevation: 50,

    // The number of pages

    pages: pageCount,

    // default Page

    page: currentPage,

    // Events

    when: {
      turning: function(event, page, view) {
        removeSticky();
        $('#wPaint').wPaint('clear');
        var book = $(this),
          //
          currentPage = page;     
        currentPageNo = view;
        console.log("view", view);
        pages = book.turn('pages');
       // console.log("pages:", book.turn('pages'));
        $('#flipsound')[0].play();
        // Update the current URI

        Hash.go('page/' + page).update();

        // Show and hide navigation buttons
        disableControls(page);

       // console.log(book.data());

      },

      turned: function(event, page, view) {
        currentPage = page;
        //console.log(currentPage);
        disableControls(page);
        $('#wPaint').wPaint('clear');

        $(this).turn('center');

        $('#slider').slider('value', getViewNumber($(this), page));

        if (page == 1) {
          $(this).turn('peel', 'br');
        }
        down = true;
        if (openNotes) {
          loadSticky(page);
        }
        loadAnnotations(currentPage);
      },

      missing: function(event, pages) {
        for (var i = 0; i < pages.length; i++)
          addPage(pages[i], $(this));
      }
    }

  });

  // Zoom.js
  zoomApp();

  // URIs - Format #/page/1

  Hash.on('^page\/([0-9]*)$', {
    yep: function(path, parts) {
      var page = parts[1];
      currentPage = page;
      console.log(currentPage);
      if (page !== undefined) {
        if ($('.magazine').turn('is'))
          $('.magazine').turn('page', page);
      }

    },
    nop: function(path) {

      if ($('.magazine').turn('is'))
        $('.magazine').turn('page', 1);
    }
  });


  $(window).resize(function() {
    resizeViewport();
  }).bind('orientationchange', function() {
    resizeViewport();
  });

  // Regions

  if ($.isTouch) {
    $('.magazine').bind('touchstart', regionClick);
  } else {
    $('.magazine').click(regionClick);
  }

  // Events for the next button

  $('#next-button').bind($.mouseEvents.over, function() {

    $(this).addClass('next-button-hover');

  }).bind($.mouseEvents.out, function() {

    $(this).removeClass('next-button-hover');

  }).bind($.mouseEvents.down, function() {

    $(this).addClass('next-button-down');

  }).bind($.mouseEvents.up, function() {

    $(this).removeClass('next-button-down');

  }).click(function(e) {
    var e = jQuery.Event("keydown", { keyCode: 39 });
    jQuery("body").trigger( e );
  });

  // Events for the next button

  $('#previous-button').bind($.mouseEvents.over, function() {

    $(this).addClass('previous-button-hover');

  }).bind($.mouseEvents.out, function() {

    $(this).removeClass('previous-button-hover');

  }).bind($.mouseEvents.down, function() {

    $(this).addClass('previous-button-down');

  }).bind($.mouseEvents.up, function() {

    $(this).removeClass('previous-button-down');

  }).click(function() {

    var e = jQuery.Event("keydown", { keyCode: 37 });
    jQuery("body").trigger( e );

  });


  // Slider

  $("#slider").slider({
    min: 1,
    max: numberOfViews(flipbook),

    start: function(event, ui) {

      if (!window._thumbPreview) {
        _thumbPreview = $('<div />', {
          'class': 'thumbnail'
        }).html('<div></div>');
        setPreview(ui.value);
        _thumbPreview.appendTo($(ui.handle));
      } else
        setPreview(ui.value);

      moveBar(false);

    },

    slide: function(event, ui) {

      setPreview(ui.value);

    },

    stop: function() {

      if (window._thumbPreview)
        _thumbPreview.removeClass('show');

      $('.magazine').turn('page', Math.max(1, $(this).slider('value') * 2 - 2));

    }
  });

  resizeViewport();

  $('.magazine').addClass('animated');
  $("#loader").hide();

}

// Zoom icon
