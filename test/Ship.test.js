import Ship from "../src/Ship";

test("Ship gets hit", () => {
	const ship = Ship(3);
	ship.hit();
	expect(ship.hits).toBe(1);
});

test("Ship gets sunk when its hits equal its length", () => {
	const ship = Ship(2);
	ship.hit();
	expect(ship.isSunk()).toBe(false);
	ship.hit();
	expect(ship.isSunk()).toBe(true);
});

test("Ship hits don't increase above its length", () => {
	const ship = Ship(1);
	ship.hit();
	ship.hit();
	expect(ship.hits).toBe(1);
});

test("Ship length must be a number", () => {
	expect(() => Ship("hello")).toThrow(TypeError);
});

test("Ship length can't be non-positive", () => {
	expect(() => Ship(-2)).toThrow(RangeError);
});
