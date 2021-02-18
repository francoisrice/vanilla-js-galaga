import { GRID_SIZE, OBJECT_TYPE } from './setup';

export function spawner() {
	const spawnRow = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;

	// Change Row to absolute position at the far right before the edge
	const spawnPos = spawnRow * GRID_SIZE + GRID_SIZE - 2;

	return spawnPos;
}
