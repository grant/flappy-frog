$(function () {
	var FADE_DURATION = 100;
	// UI layers
	var $menu = $('.menu');
	var $getReady = $('.getReady');
	var $gameover = $('.gameover');

	var windowWidth = $(window).width();
	var windowHeight= $(window).height();

	var inGame = false;
	var isReady = false;
	var score = 0;
	var best = 0;

	var gameTime =
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
	$gameover.find('button').click(function () {
		reset();
	});

	// Tap click
	$('.container').click(function () {
		if (!inGame && isReady) {
			// Start game
			inGame = true;
			isReady = false;
			$getReady.find('.instructions').fadeOut(FADE_DURATION);
		}

		if (inGame) {
			vy = -CLICK_POWER;

			// temp
			gameover();
			addPipe();
		}
	});

	// Game
	var CLICK_POWER = 1.5;
	var MAX_VY = 1.5;
	var PIPE_SPEED = 2; // % of screen width

	var pipes = [];

	var vy = 0;
	var y = 0;
	var g = 0.08;
	var $frog = $('.frog');
	var $pipeArea = $('.pipes');

	// Renders a game frame
	function render() {
		if (inGame) {
			calculateWorld();
		}
		renderWorld();
	}

	// Calculates stuff for the world
	function calculateWorld () {
		// Update frog velocity
		vy += g;
		if (vy > MAX_VY) {
			vy = MAX_VY;
		}
		y += vy;
	}

	// Renders the current world
	function renderWorld () {
		// Frog
		$frog.css('top', y + '%');

		// Pipes
		for (var i in pipes) {
			var $pipe = pipes[i];
			var pipeX = $pipe.css('left');
			pipeX = pipeX.substring(0, pipeX.length - 2);
			pipeX -= (PIPE_SPEED/100)*windowWidth;
			$pipe.css('left', pipeX + 'px');
		}
	}

	// Adds a pipe to the screen
	function addPipe () {
		var $pipe = $('<div/>').addClass('pipe');
		$pipe.css('left', windowWidth + 'px');
		pipes.push($pipe);
		$pipeArea.append($pipe);
	}

	// Goes to the game over ui
	function gameover () {
		inGame = false;

		// Set ui
		$gameover.show();

		// Set score
		best = Math.max(best, score);
	}

	// Resets the game to the menu
	function reset () {
		score = 0;
		$gameover.hide();
		$menu.show();
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

	// The animation loop
	(function animloop(){
		requestAnimFrame(animloop);
		render();
	})();
});