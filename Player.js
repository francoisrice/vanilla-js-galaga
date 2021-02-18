import { OBJECT_TYPE, DIRECTIONS } from './setup';

// export default class Pacman {
export default class Player {
	constructor(speed, startPos) {
		this.pos = startPos;
		this.speed = speed;
		this.dir = null;
		this.timer = 0;
		this.bulletShouldFire = false;
		this.bulletTimer = 0;
		this.reloadTime = 3;
		this.powerup1 = false;
		this.powerup2 = false;
		this.powerup3 = false;
		this.powerup4 = false;
	}

	shouldMove() {
		if (!this.dir) return false;

		if (this.timer >= this.speed) {
			this.timer = 0;
			return true;
		}
		this.timer++;
	}

	shouldFireBullet() {
		if (!this.bulletShouldFire) return false;

		if (this.bulletTimer >= this.reloadTime) {
			this.bulletTimer = 0;
			return true;
		}
		this.bulletTimer++;
	}

	getNextMove(objectExist) {
		let nextMovePos = this.pos + this.dir.movement;

		if (
			objectExist(nextMovePos, OBJECT_TYPE.WALL) |
			objectExist(nextMovePos, OBJECT_TYPE.EDGE)
		) {
			nextMovePos = this.pos;
		}

		return { nextMovePos, direction: this.dir };
	}

	makeMove() {
		const classesToRemove = [OBJECT_TYPE.PLAYER];
		const classesToAdd = [OBJECT_TYPE.PLAYER];

		return { classesToRemove, classesToAdd };
	}

	setNewPos(nextMovePos) {
		this.pos = nextMovePos;
	}

	fireBullet() {
		const classesToAdd = [OBJECT_TYPE.PLAYERBULLET];

		return { classesToAdd };
	}

	handleKeyDown(e, objectExist) {
		let dir;

		if (e.keyCode >= 37 && e.keyCode <= 40) {
			dir = DIRECTIONS[e.key];
		} else if (e.keyCode == 32) {
			this.bulletShouldFire = true;
			return;
		} else {
			return;
		}

		const nextMovePos = this.pos + dir.movement;
		if (
			objectExist(nextMovePos, OBJECT_TYPE.WALL) |
			objectExist(nextMovePos, OBJECT_TYPE.EDGE)
		)
			return;
		this.dir = dir;
	}

	handleKeyUp(e) {
		if (e.keyCode >= 37 && e.keyCode <= 40) {
			this.dir = null;
		} else if (e.keyCode == 32) {
			this.bulletShouldFire = false;
		} else {
			return;
		}
	}
}
