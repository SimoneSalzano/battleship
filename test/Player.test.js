import Player from "../src/Player";
import Gameboard from "../src/Gameboard";

test("AI makes a valid move", () => {
	const ai = Player("AI", Gameboard(2), Gameboard(2), true);
	let currentTurns = ai.turns;
	for (let i = 0; i < 4; i += 1) {
		ai.makeMove();
		expect(ai.turns).toBe(currentTurns + 1);
		currentTurns = ai.turns;
	}
});

test("Humans can't make random moves", () => {
	const human = Player("John", Gameboard(2), Gameboard(2), false);
	for (let i = 0; i < 4; i += 1) {
		human.makeMove();
	}
	expect(human.turns).toBe(0);
});
