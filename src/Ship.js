let id = 0;

const Ship = (length) => {
	if (!(typeof length === "number"))
		throw new TypeError("Ship length must be a number");
	if (length <= 0) throw new RangeError("Ship length must be positive");

	let hits = 0;
	id += 1;
	const hit = () => {
		if (hits < length) hits += 1;
	};

	const isSunk = () => hits === length;

	return {
		id,
		get hits() {
			return hits;
		},
		get length() {
			return length;
		},
		hit,
		isSunk,
	};
};

export default Ship;
