import Gameboard from "../src/Gameboard";

let gm;

beforeEach(() => {
	gm = Gameboard(8);
});

test("Ship gets placed only in a valid spot", () => {
	const length = 3;
	expect(() => gm.placeShip(length, [-4, 0])).toThrow(RangeError);
	expect(() => gm.placeShip(length, [7, 7], true)).toThrow(RangeError);
	expect(() => gm.placeShip(length, [6, 5], true)).not.toThrow(RangeError);
});

test("Ship gets placed properly", () => {
	const length = 3;
	gm.placeShip(length, [0, 3], true);
	let placed = gm.shipPos[0][3];
	expect(placed).toBeInstanceOf(Object);
	expect(gm.shipPos[0][4]).toBe(placed);
	expect(gm.shipPos[0][5]).toBe(placed);
	expect(gm.shipPos[0][2]).not.toBe(placed);
	expect(gm.shipPos[3][0]).not.toBe(placed);
	gm.placeShip(length, [5, 3]);
	// eslint-disable-next-line prefer-destructuring
	placed = gm.shipPos[5][3];
	expect(placed).toBeInstanceOf(Object);
	expect(gm.shipPos[6][3]).toBe(placed);
	expect(gm.shipPos[7][3]).toBe(placed);
	expect(gm.shipPos[4][3]).not.toBe(placed);
	expect(gm.shipPos[5][2]).not.toBe(placed);
});

test("Can't place a ship in a location where another ship is placed", () => {
	const length = 3;
	gm.placeShip(length, [0, 0], false);
	expect(() => gm.placeShip(length, [2, 0], true)).toThrow(
		"Another ship is already placed at (0,2)"
	);
});
