const Player = (name, ownGameboard, enemyGameboard, isComputer = false) => {
	let turns = 0;
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
		const legalMoves = getLegalMoves();
		const attackCoords =
			legalMoves[Math.floor(Math.random() * legalMoves.length)];
		const result = attack(attackCoords[1], attackCoords[0]);
		return { x: attackCoords[1], y: attackCoords[0], result };
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
