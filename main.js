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
		console.log('hi');
		if (!inGame && isReady) {
			// Start game
			inGame = true;
			isReady = false;
			$getReady.find('.instructions').fadeOut(FADE_DURATION);
		}

		if (inGame) {
			vy = -CLICK_POWER;
		}
	});

	// Game
	var CLICK_POWER = 1.5;
	var MAX_VY = 1.5;

	var vy = 0;
	var y = 0;
	var g = 0.08;
	var $frog = $('.frog');
	function render() {
		if (inGame) {
			calculateWorld();
			renderWorld();
		}
	}

	// Calculates stuff for the world
	function calculateWorld () {
		vy += g;
		if (vy > MAX_VY) {
			vy = MAX_VY;
		}
		y += vy;
	}

	// Renders the current world
	function renderWorld () {
		$frog.css('top', y + '%');
	}

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	(function animloop(){
		requestAnimFrame(animloop);
		render();
	})();
});