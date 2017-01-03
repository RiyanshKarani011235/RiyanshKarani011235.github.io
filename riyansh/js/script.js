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
	new Notebook(3, 6, 3);

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

	var menuBar = $('#menu_bar');
	var menuBarBottom = menuBar.offset().top + menuBar.outerHeight();

	//when scroll
	// $(window).scroll(function(){

	// 	console.log("scrolled");

	// 	// keep menu bar fised on the top
	// 	//Calculate the height of <header>
	// 	//Use outerHeight() instead of height() if have padding
	// 	console.log(menuBarBottom); 

	// 	//if scrolled down more than the header’s height
	// 	if ($(window).scrollTop() > menuBarBottom){

	// 		// if yes, add “fixed” class to the <nav>
	// 		// add padding top to the #content 
	// 		// (value is same as the height of the nav)
	// 		menuBar.addClass('fixed').css('top','0').next()
	// 		.css('padding-top','60px');
	// 		console.log('fixed');

	// 	} else {

	// 		// when scroll up or less than aboveHeight,
	// 		// remove the “fixed” class, and the padding-top
	// 		menuBar.removeClass('fixed').next()
	// 		.css('padding-top','0');
	// 		console.log('released');
	// 	}
	// });
});