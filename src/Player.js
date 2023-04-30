const Player = (name, ownGameboard, enemyGameboard, isComputer = false) => {
	let turns = 0;
	const lastHits = [];
	const attack = (x, y) => {
		if (enemyGameboard.shots[y][x]) return false;
		turns += 1;
		return enemyGameboard.recieveAttack(x, y);
	};

	const getLegalMoves = () => {
		const legalMoves = [];
		for (let i = 0; i < enemyGameboard.shots.length; i += 1)
			for (let j = 0; j < enemyGameboard.shots.length; j += 1) {
				if (!enemyGameboard.shots[i][j]) legalMoves.push([i, j]);
			}
		return legalMoves;
	};

	const makeMove = () => {
		if (!isComputer) return false;
		let attacked = false;
		let ret;
		let trys = 0;
		if (lastHits.length > 0) {
			const directions = [
				[0, 1],
				[0, -1],
				[1, 0],
				[-1, 0],
			];
			while (lastHits.length > 0) {
				const [y, x] = lastHits[lastHits.length - 1];
				const newX = x + directions[trys][1];
				const newY = y + directions[trys][0];
				if (enemyGameboard.canAttack(newX, newY)) {
					const result = attack(newX, newY);
					attacked = true;
					if (result === "hit") lastHits.push([newY, newX]);
					else if (result === "sunk") lastHits.pop();
					ret = { x: newX, y: newY, result };
					break;
				}
				trys += 1;
				if (trys === 4) {
					trys = 0;
					lastHits.pop();
				}
			}
		}
		if (!attacked) {
			const legalMoves = getLegalMoves();
			const attackCoords =
				legalMoves[Math.floor(Math.random() * legalMoves.length)];
			const result = attack(attackCoords[1], attackCoords[0]);
			if (result === "hit") lastHits.push(attackCoords);
			ret = { x: attackCoords[1], y: attackCoords[0], result };
		}
		return ret;
	};

	return {
		name,
		makeMove,
		isComputer,
		ownGameboard,
		enemyGameboard,
		attack,
		get turns() {
			return turns;
		},
	};
};

export default Player;
