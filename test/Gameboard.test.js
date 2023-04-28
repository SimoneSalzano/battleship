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

	test("Placeability is well tracked", () => {
		expect(gb.canPlace(3, 3, 3, true)).toBe(true);
		expect(gb.canPlace(6, 3, 3, true)).toBe(false);
		expect(gb.canPlace(3, 6, 3, true)).toBe(true);
		gb.placeShip(3, [6, 3], true);
		expect(gb.canPlace(4, 6, 3, true)).toBe(false);
		expect(gb.canPlace(5, 3, 3, true)).toBe(true);
		expect(gb.canPlace(5, 9, 3, false)).toBe(false);
	});
});

describe("Random Placements", () => {
	test("Random ship placement doesn't occur when not passing an array of lengths", () => {
		expect(() => gb.placeRandomly("Hello!")).toThrow(
			"You must pass an array of lengths to place ships randomly!"
		);
	});

	test("Random ship placement doesn't occur when the array passed contains something that is not a length", () => {
		expect(() => gb.placeRandomly([5, "Hello!", 3])).toThrow(
			"An array of lengths must contain only positive numbers!"
		);
		expect(() => gb.placeRandomly([5, 0, 3])).toThrow(
			"An array of lengths must contain only positive numbers!"
		);
		expect(() => gb.placeRandomly([5, 3, -3])).toThrow(
			"An array of lengths must contain only positive numbers!"
		);
	});

	test("Random placement succeeds", () => {
		expect(() => gb.placeRandomly([5, 3, 2, 5, 1])).not.toThrow(Error);
	});

	test("Random placement won't happen in a too small board", () => {
		const smallBoard = Gameboard(2);
		expect(() => smallBoard.placeRandomly([1, 1, 1, 1, 1, 1])).toThrow(Error);
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
	test("Attacks are properly registered", () => {
		gb.placeShip(2, [0, 0], true);
		gb.recieveAttack(2, 2);
		expect(gb.shots[0][0]).toBe(false);
		expect(gb.shots[2][2]).toBe(true);
		gb.recieveAttack(0, 0);
		expect(gb.shots[0][0]).toBe(true);
	});
});

test("Get notified when all ships get sunk", () => {
	gb.placeShip(1, [0, 0]);
	gb.placeShip(1, [2, 2]);
	expect(gb.isAllSunk()).toBe(false);
	gb.recieveAttack(0, 0);
	expect(gb.isAllSunk()).toBe(false);
	gb.recieveAttack(2, 2);
	expect(gb.isAllSunk()).toBe(true);
});
