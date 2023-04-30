import Gameboard from "./Gameboard";
import Player from "./Player";
import DOM from "./DOM";

const initialize = (boardSize, name1, name2, againstAI = true) => {
	const g1 = Gameboard(boardSize);
	const g2 = Gameboard(boardSize);
	const shipLengths = [5, 4, 3, 3, 2];
	g1.placeRandomly(shipLengths);
	g2.placeRandomly(shipLengths);
	const p1 = Player(name1, g1, g2, false);
	const p2 = Player(name2, g2, g1, againstAI);
	const UI = DOM(g1, g2);
	UI.attackAction = (x, y) => {
		if (!p1.ownGameboard.isAllSunk() && !p1.enemyGameboard.isAllSunk())
			return p1.attack(x, y);
		return false;
	};
	UI.attackFollowUp = () => {
		if (!p2.ownGameboard.isAllSunk()) {
			const { x, y, result } = p2.makeMove();
			UI.visualizeShot(false, result, x, y);
			if (p1.ownGameboard.isAllSunk())
				UI.displayEndMessage("Oh no! You lost all your ships!");
		} else {
			UI.displayEndMessage("Yay! You won!");
		}
	};
	UI.initializeBoards(boardSize);
	UI.reset = () => initialize(boardSize, name1, name2, againstAI);
	return { p1, p2, UI };
};

initialize(9, "John", "AI");
