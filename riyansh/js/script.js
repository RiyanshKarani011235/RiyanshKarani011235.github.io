var scrollUp = function() {
    $('html, body').animate({
          scrollTop: $('#header').offset().top
        }, 1000);
}

var scrollDown = function() {
    $('html, body').animate({
          scrollTop: $('#footer').offset().top
        }, 1000);
}

$(window).load(function () {
    new Notebook();

    // set eventListeners for navigation buttons
    // up navigation button
    $("#up_navigation_button").click(function() {
    	scrollUp();
    });

    // down navigation button
    $("#down_navigation_button").click(function() {
    	scrollDown();
    });

    $("#github_icon").click(function() {
        console.log("github icon clicked");
        scrollDown();
    });
});