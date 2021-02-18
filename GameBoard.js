import { GRID_SIZE, CELL_SIZE, OBJECT_TYPE, CLASS_LIST } from './setup';
import PlayerBullet from './PlayerBullet';
import EnemyBullet from './EnemyBullet';
import { spawner } from './spawnAI';
import Enemy from './Enemy';

class GameBoard {
	constructor(DOMGrid) {
		this.grid = [];
		this.DOMGrid = DOMGrid;
		this.objects = {
			enemy: [],
			enemybullet: [],
			playerbullet: [],
		};
		this.spawnTimer = 0;
		this.spawnSlowness = 15;
	}

	showGameStatus(gameWin) {
		// game over or not
		const div = document.createElement('div');
		div.classList.add('game-status');
		div.innerHTML = `${gameWin ? 'WIN' : 'GAME OVER!'}`;
		this.DOMGrid.appendChild(div);
	}

	createGrid(level) {
		this.grid = [];
		this.DOMGrid.innerHTML = '';
		this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px)`;

		level.forEach((square) => {
			const div = document.createElement('div');
			div.classList.add('square', CLASS_LIST[square]);
			div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`;
			this.DOMGrid.appendChild(div);
			this.grid.push(div);
		});
	}

	resetObjects() {
		this.objects = {
			enemy: [],
			enemybullet: [],
			playerbullet: [],
		};
	}

	// draw Object on game board
	addObject(pos, classes) {
		this.grid[pos].classList.add(...classes);
	}

	// undraw Object
	removeObject(pos, classes) {
		this.grid[pos].classList.remove(...classes);
	}

	objectExist = (pos, objects) => {
		return this.grid[pos].classList.contains(objects);
	};

	shouldSpawnEnemy() {
		if (this.spawnTimer >= this.spawnSlowness) {
			this.spawnTimer = 0;
			return true;
		}
		this.spawnTimer++;
		return false;
	}

	moveCharacter(character) {
		if (character.shouldMove()) {
			const { nextMovePos, direction } = character.getNextMove(
				this.objectExist,
			);
			const { classesToRemove, classesToAdd } = character.makeMove();

			this.removeObject(character.pos, classesToRemove);

			if (!this.objectExist(nextMovePos, OBJECT_TYPE.EDGE)) {
				this.addObject(nextMovePos, classesToAdd);
			} else {
				this.despawn(character.pos, ...classesToRemove);
			}

			character.setNewPos(nextMovePos, direction);
		}
	}

	spawnEnemy() {
		if (this.shouldSpawnEnemy()) {
			const classesToAdd = [OBJECT_TYPE.ENEMY];

			const spawnPos = spawner();

			this.addObject(spawnPos, classesToAdd);

			this.objects['enemy'].push(new Enemy(10, spawnPos));
		}
	}

	spawnPlayerBullet(character) {
		if (character.shouldFireBullet()) {
			const { classesToAdd } = character.fireBullet();

			this.addObject(character.pos, classesToAdd);
			this.objects['playerbullet'].push(
				new PlayerBullet(1, character.pos),
			);
		}
	}

	spawnEnemyBullet(character) {
		if (character.shouldFireBullet()) {
			const { classesToAdd } = character.fireBullet();

			this.addObject(character.pos, classesToAdd);
			this.objects['enemybullet'].push(
				new EnemyBullet(1, character.pos),
			);
		}
	}

	despawn(pos, classType) {
		const index = this.objects[classType].findIndex(
			(object) => object.pos === pos,
		);
		if (index > -1) {
			this.objects[classType].splice(index, 1);
		}
	}

	static createGameBoard(DOMGrid, level) {
		const board = new this(DOMGrid);
		board.createGrid(level);
		return board;
	}
}

export default GameBoard;
