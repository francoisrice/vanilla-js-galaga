import { OBJECT_TYPE, DIRECTIONS } from './setup';

export default class EnemyBullet {
	constructor(slowness = 10, startPos) {
		this.startPos = startPos;
		this.pos = startPos;
		this.dir = DIRECTIONS.ArrowLeft;
		this.slowness = slowness;
		this.timer = 0;
	}

	shouldMove() {
		if (this.timer >= this.slowness) {
			this.timer = 0;
			return true;
		}
		this.timer++;
		return false;
	}

	getNextMove(objectExist) {
		let nextMovePos = this.pos + this.dir.movement;

		return { nextMovePos, direction: this.dir };
	}

	makeMove() {
		const classesToRemove = [OBJECT_TYPE.ENEMYBULLET];
		const classesToAdd = [OBJECT_TYPE.ENEMYBULLET];

		return { classesToRemove, classesToAdd };
	}

	setNewPos(nextMovePos, direction) {
		this.pos = nextMovePos;
		this.dir = direction;
	}
}
