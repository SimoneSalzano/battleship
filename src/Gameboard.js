import Ship from "./Ship";

const Gameboard = (size) => {
	const shots = Array(size);
	const shipPos = Array(size);
	let shipsPlaced = 0;
	let shipsSunk = 0;
	for (let i = 0; i < size; i += 1) {
		shots[i] = Array(size).fill(false);
		shipPos[i] = Array(size).fill(false);
	}

	const isValidCoordinate = (c) => c >= 0 && c < size;

	const placeShip = (ofLength, startPos, horizontally = false) => {
		const [y, x] = startPos;
		if (!isValidCoordinate(x) || !isValidCoordinate(y))
			throw new RangeError(
				`Position ${startPos} is out of bound for a board of size ${size}.`
			);
		if (horizontally) {
			if (!isValidCoordinate(x + ofLength - 1)) {
				throw new RangeError(
					`Ship of length ${ofLength} can't be horizontally positioned at (${x},${y})`
				);
			}
			const ship = Ship(ofLength);
			for (let i = 0; i < ofLength; i += 1)
				if (shipPos[y][x + i])
					throw new Error(`Another ship is already placed at (${x},${y})`);
			for (let i = 0; i < ofLength; i += 1) shipPos[y][x + i] = ship;
		} else {
			if (!isValidCoordinate(y + ofLength - 1)) {
				throw new RangeError(
					`Ship of length ${ofLength} can't be vertically positioned at (${x},${y})`
				);
			}
			const ship = Ship(ofLength);
			for (let i = 0; i < ofLength; i += 1)
				if (shipPos[y + i][x])
					throw new Error(`Another ship is already placed at (${x},${y})`);
			for (let i = 0; i < ofLength; i += 1) shipPos[y + i][x] = ship;
		}
		shipsPlaced += 1;
	};

	const recieveAttack = (x, y) => {
		if (!isValidCoordinate(x) || !isValidCoordinate(y))
			throw new RangeError("Can't attack out of the board!");
		if (shots[y][x])
			throw new EvalError("You can't attack the same coordinates twice!");
		shots[y][x] = true;
		const ship = shipPos[y][x];
		if (!shipPos[y][x]) return "miss";
		ship.hit();
		if (!ship.isSunk()) return "hit";
		shipsSunk += 1;
		return "sunk";
	};

	const isAllSunk = () => shipsPlaced === shipsSunk;

	return {
		get shipPos() {
			return shipPos;
		},
		get shots() {
			return shots;
		},
		placeShip,
		recieveAttack,
		isAllSunk,
	};
};

export default Gameboard;
