const Ship = (length) => {
	if (!(typeof length === "number"))
		throw new TypeError("Ship length must be a number");
	if (length <= 0) throw new RangeError("Ship length must be positive");

	let hits = 0;

	const hit = () => {
		if (hits < length) hits += 1;
	};

	const isSunk = () => hits === length;

	return {
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
