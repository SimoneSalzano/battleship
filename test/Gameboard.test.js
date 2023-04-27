import Gameboard from "../src/Gameboard";

let gb;

beforeEach(() => {
	gb = Gameboard(8);
});

describe("Ship placement", () => {
	test("Ship gets placed only in a valid spot", () => {
		const length = 3;
		expect(() => gb.placeShip(length, [-4, 0])).toThrow(RangeError);
		expect(() => gb.placeShip(length, [7, 7], true)).toThrow(RangeError);
		expect(() => gb.placeShip(length, [6, 5], true)).not.toThrow(RangeError);
	});

	test("Ship gets placed properly", () => {
		const length = 3;
		gb.placeShip(length, [0, 3], true);
		let placed = gb.shipPos[0][3];
		expect(placed).toBeInstanceOf(Object);
		expect(gb.shipPos[0][4]).toBe(placed);
		expect(gb.shipPos[0][5]).toBe(placed);
		expect(gb.shipPos[0][2]).not.toBe(placed);
		expect(gb.shipPos[3][0]).not.toBe(placed);
		gb.placeShip(length, [5, 3]);
		// eslint-disable-next-line prefer-destructuring
		placed = gb.shipPos[5][3];
		expect(placed).toBeInstanceOf(Object);
		expect(gb.shipPos[6][3]).toBe(placed);
		expect(gb.shipPos[7][3]).toBe(placed);
		expect(gb.shipPos[4][3]).not.toBe(placed);
		expect(gb.shipPos[5][2]).not.toBe(placed);
	});

	test("Can't place a ship in a location where another ship is placed", () => {
		const length = 3;
		gb.placeShip(length, [0, 0], false);
		expect(() => gb.placeShip(length, [2, 0], true)).toThrow(
			"Another ship is already placed at (0,2)"
		);
	});
});

describe("Attacks", () => {
	test("Invalid coordinates won't pass", () => {
		expect(() => gb.recieveAttack(9, 9)).toThrow(RangeError);
	});
	test("Attack succeeds", () => {
		gb.placeShip(3, [0, 0], true);
		expect(gb.recieveAttack(0, 0)).toBe("hit");
	});
	test("Attacks sink a ship", () => {
		gb.placeShip(2, [0, 0], true);
		expect(gb.recieveAttack(0, 0)).toBe("hit");
		expect(gb.recieveAttack(1, 0)).toBe("sunk");
	});
	test("Attack misses", () => {
		gb.placeShip(2, [0, 0], true);
		expect(gb.recieveAttack(5, 5)).toBe("miss");
	});
	test("Can't attack at the same coordinates twice", () => {
		gb.placeShip(2, [0, 0], true);
		gb.recieveAttack(0, 0);
		expect(() => gb.recieveAttack(0, 0)).toThrow(
			"You can't attack the same coordinates twice!"
		);
	});
});
