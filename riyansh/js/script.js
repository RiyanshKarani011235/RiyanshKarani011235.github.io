$(window).load(function () {
    new Notebook();

    // set eventListeners for navigation buttons
    // up navigation button
    $("#up_navigation_button").click(function() {
    	$('html, body').animate({
          scrollTop: $('#header').offset().top
        }, 1000);
    });

    // down navigation button
    $("#down_navigation_button").click(function() {
    	$('html, body').animate({
          scrollTop: $('#footer').offset().top
        }, 1000);
    });
});