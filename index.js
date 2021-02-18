import { LEVEL, OBJECT_TYPE } from './setup';
import GameBoard from './GameBoard';
import Player from './Player';

// DOM Elements - Game screen
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

// Game Constants
const GLOBAL_SPEED = 40; // ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);
const debug = false;

// Initial Setup
let score = 0;
let timer = null;
let gameWin = false;

function gameOver(player) {
	document.removeEventListener('keydown', (e) => {
		player.handleKeyDown(e, gameBoard.objectExist);
	});
	document.removeEventListener('keyup', (e) => player.handleKeyUp(e));

	gameBoard.resetObjects();
	gameBoard.showGameStatus(gameWin);
	clearInterval(timer);
	startButton.classList.remove('hide');
}

function checkCollision(
	player,
	enemies,
	enemybullets = [],
	playerbullets = [],
) {
	const collidedBullet = enemybullets.find(
		(enemybullet) => player.pos === enemybullet.pos,
	);
	if (collidedBullet) {
		gameBoard.removeObject(player.pos, [OBJECT_TYPE.PLAYER]);
		gameOver(player, gameGrid);
	}

	const collidedEnemy = enemies.find(
		(enemy) => player.pos === enemy.pos,
	);
	if (collidedEnemy) {
		gameBoard.removeObject(player.pos, [OBJECT_TYPE.PLAYER]);
		gameOver(player, gameGrid);
	}

	enemies.forEach((enemy) => {
		playerbullets.forEach((bullet) => {
			if (bullet.pos == enemy.pos) {
				gameBoard.removeObject(enemy.pos, [
					OBJECT_TYPE.ENEMY,
					OBJECT_TYPE.PLAYERBULLET,
				]);
				gameBoard.despawn(bullet.pos, OBJECT_TYPE.PLAYERBULLET);
				gameBoard.despawn(enemy.pos, OBJECT_TYPE.ENEMY);
				score += 100;
			}
		});
	});
}

function gameLoop(player, enemies) {
	scoreTable.innerHTML = score;

	gameBoard.spawnEnemy();
	checkCollision(
		player,
		enemies,
		gameBoard.objects['enemybullet'],
		gameBoard.objects['playerbullet'],
	);

	gameBoard.spawnPlayerBullet(player);
	checkCollision(
		player,
		enemies,
		gameBoard.objects['enemybullet'],
		gameBoard.objects['playerbullet'],
	);

	enemies.forEach((enemy) => {
		gameBoard.spawnEnemyBullet(enemy);
	});
	checkCollision(
		player,
		enemies,
		gameBoard.objects['enemybullet'],
		gameBoard.objects['playerbullet'],
	);

	gameBoard.moveCharacter(player);
	checkCollision(
		player,
		enemies,
		gameBoard.objects['enemybullet'],
		gameBoard.objects['playerbullet'],
	);

	enemies.forEach((enemy) => gameBoard.moveCharacter(enemy));
	checkCollision(
		player,
		enemies,
		gameBoard.objects['enemybullet'],
		gameBoard.objects['playerbullet'],
	);

	gameBoard.objects['playerbullet'].forEach((bullet) => {
		gameBoard.moveCharacter(bullet);
	});
	checkCollision(
		player,
		enemies,
		gameBoard.objects['enemybullet'],
		gameBoard.objects['playerbullet'],
	);

	gameBoard.objects['enemybullet'].forEach((bullet) => {
		gameBoard.moveCharacter(bullet);
	});
	checkCollision(
		player,
		enemies,
		gameBoard.objects['enemybullet'],
		gameBoard.objects['playerbullet'],
	);
}

function startGame() {
	if (startButton.innerHTML == 'Start Game') {
		gameWin = false;
		score = 0;

		if (debug) {
			startButton.innerHTML = 'Stop Game';
		} else {
			startButton.classList.add('hide');
		}

		gameBoard.createGrid(LEVEL);

		const player = new Player(1, 182);
		gameBoard.addObject(182, [OBJECT_TYPE.PLAYER]);
		document.addEventListener('keydown', (e) => {
			player.handleKeyDown(e, gameBoard.objectExist);
		});
		document.addEventListener('keyup', (e) => {
			player.handleKeyUp(e);
		});

		timer = setInterval(
			() => gameLoop(player, gameBoard.objects['enemy']),
			GLOBAL_SPEED,
		);
	} else if (startButton.innerHTML === 'Stop Game') {
		gameOver();
		startButton.innerHTML = 'Start Game';
	}
}
startButton.addEventListener('click', startGame);
