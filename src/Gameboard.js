const Gameboard = (size) => {
	const shots = Array(size);
	const shipPos = Array(size);
	for (let i = 0; i < size; i += 1) {
		shots[i] = Array(size);
		shipPos[i] = Array(size);
	}

	const placeShip = (ship, startPos, horizontally = false) => {
		const [y, x] = startPos;
		if (x < 0 || x >= size || y < 0 || y >= size)
			throw new RangeError(
				`Position ${startPos} is out of bound for a board of size ${size}.`
			);
		if (horizontally) {
			if (x + ship.length > size) {
				throw new RangeError(
					`Ship of length ${ship.length} can't be horizontally positioned at (${x},${y})`
				);
			}
			for (let i = 0; i < ship.length; i += 1)
				if (shipPos[y][x + i])
					throw new Error(`Another ship is already placed at (${x},${y})`);
			for (let i = 0; i < ship.length; i += 1) shipPos[y][x + i] = ship;
		} else {
			if (y + ship.length > size) {
				throw new RangeError(
					`Ship of length ${ship.length} can't be vertically positioned at (${x},${y})`
				);
			}
			for (let i = 0; i < ship.length; i += 1)
				if (shipPos[y + i][x])
					throw new Error(`Another ship is already placed at (${x},${y})`);
			for (let i = 0; i < ship.length; i += 1) shipPos[y + i][x] = ship;
		}
	};

	return {
		get shipPos() {
			return shipPos;
		},
		get shots() {
			return shots;
		},
		placeShip,
	};
};

export default Gameboard;
