const Player = (name, ownGameboard, enemyGameboard, isComputer = false) => {
	let turns = 0;
	const attack = (x, y) => {
		if (enemyGameboard.shots[y][x]) return;
		enemyGameboard.recieveAttack(x, y);
		turns += 1;
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
		if (!isComputer) return;
		const legalMoves = getLegalMoves();
		const attackCoords =
			legalMoves[Math.floor(Math.random() * legalMoves.length)];
		attack(attackCoords[1], attackCoords[0]);
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
