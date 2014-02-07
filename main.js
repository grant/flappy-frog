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
			startGame();
		}

		if (inGame) {
			vy = -CLICK_POWER;
		}
	});

	// Game
	var CLICK_POWER = 1.5;
	var MAX_VY = 1.5;
	var PIPE_SPEED = 0.3; // % of screen width
	var PIPE_DELAY = 90; // frames between pipes
	var START_PIPE_TIME = 30; // frames between game start and the first pipe

	var frogXPercent = 33.3; // % x offset from the left of the screen

	var gameTime; // frames since gameStartTime

	var lastPipeTime; // gameTime when the last pipe was added
	var nextPipeIndex = 0;
	var pipes = [];

	// calculated
	var pipesPerScreen = 100/(PIPE_SPEED * PIPE_DELAY);
	var timeFromNewPipeToScore = (100 - frogXPercent)/PIPE_SPEED; // 100 - 33.3 = PIPE_SPEED * t; Solve t
	var firstScoreTime = START_PIPE_TIME + timeFromNewPipeToScore;

	// frog init conditions
	var vy = 0;
	var y = 0;
	var g = 0.08;
	var $frog = $('.frog');
	$frog.css('left', frogXPercent + '%');
	var $pipeArea = $('.pipes');

	// Starts the
	function startGame () {
		inGame = true;
		isReady = false;
		$getReady.find('.instructions').fadeOut(FADE_DURATION);
		gameStartTime = new Date().getTime();
		gameTime = 0;
	}

	// Renders a game frame
	function render () {
		if (inGame) {
			calculateWorld();

			// Add pipe on certain times
			var firstPipe = !lastPipeTime && gameTime > START_PIPE_TIME;
			if (firstPipe || gameTime - lastPipeTime >= PIPE_DELAY) {
				addPipe();
				lastPipeTime = gameTime;
			}

			// Score
			var firstScoreTime = (gameTime - START_PIPE_TIME - timeFromNewPipeToScore);
			score = Math.max(0, Math.floor(1 + (firstScoreTime/PIPE_DELAY)));
		}
		renderWorld();

		++gameTime;
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