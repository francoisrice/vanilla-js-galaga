import { DIRECTIONS, OBJECT_TYPE } from './setup';

// export default class Enemy extends Character {
export default class Enemy {
	constructor(slowness = 5, startPos, name = '', reloadTime = 50) {
		this.name = name;
		this.startPos = startPos;
		this.pos = startPos;
		this.dir = DIRECTIONS.ArrowLeft;
		this.slowness = slowness;
		this.timer = 0;
		this.reloadTime = reloadTime;
		this.bulletTimer = 0;
	}

	shouldMove() {
		if (this.timer >= this.slowness) {
			this.timer = 0;
			return true;
		}
		this.timer++;
		return false;
	}

	shouldFireBullet() {
		if (this.bulletTimer >= this.reloadTime) {
			this.bulletTimer = 0;
			return true;
		}
		this.bulletTimer++;
		return false;
	}

	getNextMove(objectExist) {
		let nextMovePos = this.pos + this.dir.movement;

		return { nextMovePos, direction: this.dir };
	}

	makeMove() {
		const classesToRemove = [OBJECT_TYPE.ENEMY];
		let classesToAdd = [OBJECT_TYPE.ENEMY];

		return { classesToRemove, classesToAdd };
	}

	setNewPos(nextMovePos, direction) {
		this.pos = nextMovePos;
		this.dir = direction;
	}

	fireBullet() {
		const classesToAdd = [OBJECT_TYPE.ENEMYBULLET];

		return { classesToAdd };
	}
}
