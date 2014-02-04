$(function () {
	var FADE_DURATION = 100;
	var $menu = $('.menu');
	var $getReady = $('.getReady');
	var $gameover = $('.gameover');

	var inGame = false;
	var isReady = false;
	var score = 0;
	var best = 0;
	$menu.show();

	// Button clicks
	$menu.find('button').click(function () {
		$menu.fadeOut(FADE_DURATION, function () {
			$getReady.find('.instructions').show();
			$getReady.fadeIn(FADE_DURATION, function () {
				isReady = true;
			});
		});
	});

	// Tap click
	$('.container').click(function () {
		if (!inGame && isReady) {
			// Start game
			inGame = true;
			isReady = false;
			$getReady.find('.instructions').fadeOut(FADE_DURATION);
		}
	});
});