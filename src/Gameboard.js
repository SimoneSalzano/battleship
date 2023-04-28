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
	const canPlace = (x, y, length, horizontally) => {
		if (!isValidCoordinate(x) || !isValidCoordinate(y)) return false;
		if (horizontally && !isValidCoordinate(x + length - 1)) return false;
		if (!horizontally && !isValidCoordinate(y + length - 1)) return false;
		if (horizontally)
			for (let i = 0; i < length; i += 1) {
				if (shipPos[y][x + i]) return false;
			}
		else
			for (let i = 0; i < length; i += 1) if (shipPos[y + i][x]) return false;
		return true;
	};

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

	const getValidPlacements = (forLength, orientation) => {
		const placements = [];
		const xBound = size - (orientation ? forLength : 0);
		const yBound = size - (orientation ? 0 : forLength);
		for (let i = 0; i < yBound; i += 1)
			for (let j = 0; j < xBound; j += 1)
				if (canPlace(j, i, forLength, orientation)) placements.push([i, j]);
		return placements;
	};

	const placeRandomly = (lengths) => {
		if (!Array.isArray(lengths))
			throw new TypeError(
				"You must pass an array of lengths to place ships randomly!"
			);
		for (let i = 0; i < lengths.length; i += 1) {
			if (!(typeof lengths[i] === "number") || lengths[i] <= 0)
				throw new TypeError(
					"An array of lengths must contain only positive numbers!"
				);
			const l = lengths[i];
			const orient = Math.floor(Math.random() * 2);
			const placements = getValidPlacements(l, orient);
			if (placements.length === 0)
				throw new Error(`There's no space for ${lengths.length} ships!`);
			const place = placements[Math.floor(Math.random() * placements.length)];
			placeShip(l, place, orient);
		}
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
		placeRandomly,
		canPlace,
	};
};

export default Gameboard;
