import "./style.scss";
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
	DOM.initializeBoards(boardSize, g1, g2);
	return { p1, p2 };
};

initialize(9, "John", "AI");
