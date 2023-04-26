import Gameboard from "../src/Gameboard";
import Ship from "../src/Ship";

let gm;

beforeEach(() => {
	gm = Gameboard(8);
});

test("Ship gets placed only in a valid spot", () => {
	const ship = Ship(3);
	expect(() => gm.placeShip(ship, [-4, 0])).toThrow(RangeError);
	expect(() => gm.placeShip(ship, [7, 7], true)).toThrow(RangeError);
	expect(() => gm.placeShip(ship, [6, 5], true)).not.toThrow(RangeError);
});

test("Ship gets placed properly", () => {
	const ship = Ship(3);
	gm.placeShip(ship, [0, 3], true);
	expect(gm.shipPos[0][3]).toBe(ship);
	expect(gm.shipPos[0][4]).toBe(ship);
	expect(gm.shipPos[0][5]).toBe(ship);
	expect(gm.shipPos[0][2]).not.toBe(ship);
	expect(gm.shipPos[3][0]).not.toBe(ship);
	gm.placeShip(ship, [5, 3]);
	expect(gm.shipPos[5][3]).toBe(ship);
	expect(gm.shipPos[6][3]).toBe(ship);
	expect(gm.shipPos[7][3]).toBe(ship);
	expect(gm.shipPos[4][3]).not.toBe(ship);
	expect(gm.shipPos[5][2]).not.toBe(ship);
});

test("Can't place a ship in a location where another ship is placed", () => {
	const ship = Ship(3);
	gm.placeShip(ship, [0, 0], false);
	expect(() => gm.placeShip(Ship(2), [2, 0], true)).toThrow(
		"Another ship is already placed at (0,2)"
	);
});
