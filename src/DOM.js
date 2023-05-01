/* eslint-disable no-loop-func */
import "./style.scss";

const DOM = (g1, g2) => {
	const board1 = document.getElementById("board-1");
	const board2 = document.getElementById("board-2");
	const endgameModal = document.getElementById("endgame");
	const resetBtn = document.getElementById("reset");
	const tips = document.getElementById("tips");
	const axisBtn = document.getElementById("axis");
	let horizontalPlacement = true;
	let allShipsPlaced = false;
	let currShipsPlaced = 0;
	let attackFollowUp = () => {};
	let attackAction = () => {};
	let reset = () => {};

	axisBtn.onclick = () => {
		horizontalPlacement = !horizontalPlacement;
	};
	const visualizeShip = (board, x, y) => {
		const graph = board === g1 ? board1 : board2;
		let otherX = Number(x);
		let otherY = Number(y);
		const sunkShip = board.shipPos[y][x];
		while (
			otherX < board.shipPos.length &&
			board.shipPos[y][otherX] === sunkShip
		) {
			const shipCell = graph.querySelector(
				`[data-x="${otherX}"][data-y="${y}"]`
			);
			shipCell.classList.add(`ship`);
			shipCell.classList.add(`ship${1 + (sunkShip.id % 5)}`);
			otherX += 1;
		}
		otherX = Number(x) - 1;
		while (otherX >= 0 && board.shipPos[y][otherX] === sunkShip) {
			const shipCell = graph.querySelector(
				`[data-x="${otherX}"][data-y="${y}"]`
			);
			shipCell.classList.add(`ship`);
			shipCell.classList.add(`ship${1 + (sunkShip.id % 5)}`);
			otherX -= 1;
		}
		otherY = Number(y) + 1;
		while (
			otherY < board.shipPos.length - 1 &&
			board.shipPos[otherY][x] === sunkShip
		) {
			const shipCell = graph.querySelector(
				`[data-x="${x}"][data-y="${otherY}"]`
			);
			shipCell.classList.add(`ship`);
			shipCell.classList.add(`ship${1 + (sunkShip.id % 5)}`);
			otherY += 1;
		}
		otherY = Number(y) - 1;
		while (otherY >= 0 && board.shipPos[otherY][x] === sunkShip) {
			const shipCell = graph.querySelector(
				`[data-x="${x}"][data-y="${otherY}"]`
			);
			shipCell.classList.add(`ship`);
			shipCell.classList.add(`ship${1 + (sunkShip.id % 5)}`);
			otherY -= 1;
		}
	};

	const visualizeShot = (isPlayer1, result, x, y) => {
		const board = isPlayer1 ? board2 : board1;
		const target = board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
		const pin = document.createElement("div");
		if (result) {
			if (result === "hit" || result === "sunk") pin.classList.add("hit");
			else pin.classList.add("miss");
			if (isPlayer1 && result === "sunk") visualizeShip(g2, x, y);
			target.appendChild(pin);
		}
	};

	const handleClick = (target, board) => {
		if (board === board2 && allShipsPlaced) {
			const { x, y } = target.dataset;
			const result = attackAction(x, y);
			visualizeShot(true, result, x, y);
			if (result) attackFollowUp();
		}
	};

	const createCell = (ofBoard, x, y) => {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		cell.dataset.x = x;
		cell.dataset.y = y;
		const ship = ofBoard.shipPos[y][x];
		if (ofBoard === g1 && ship) {
			cell.classList.add(`ship${(ship.id % 5) + 1}`);
			cell.classList.add(`ship`);
		}
		cell.onclick = (event) => {
			const target = event.target.classList.contains("cell")
				? event.target
				: event.target.parentElement;
			handleClick(target, target.parentElement);
		};
		return cell;
	};

	const initializeBoards = (ofSize, shipLengths) => {
		tips.textContent = "Place your ships on the left board!";
		for (let i = 0; i < ofSize; i += 1) {
			for (let j = 0; j < ofSize; j += 1) {
				board1.appendChild(createCell(g1, j, i));
				board2.appendChild(createCell(g2, j, i));
			}
		}
		board2.classList.add("invalid");
		axisBtn.style.display = "block";
		const playerCells = Array.from(board1.childNodes);
		for (let i = 0; i < playerCells.length; i += 1) {
			const cell = playerCells[i];
			const { x, y } = {
				x: Number(cell.dataset.x),
				y: Number(cell.dataset.y),
			};
			const clearShipPlacement = () => {
				for (let currX = 0; currX < ofSize; currX += 1) {
					const otherCell = board1.querySelector(
						`[data-x="${currX}"][data-y="${y}"]`
					);
					otherCell.classList.remove(`ship${currShipsPlaced + 1}`);
					otherCell.style.cursor = "pointer";
				}
				for (let currY = 0; currY < ofSize; currY += 1) {
					const otherCell = board1.querySelector(
						`[data-x="${x}"][data-y="${currY}"]`
					);
					otherCell.classList.remove(`ship${currShipsPlaced + 1}`);
					otherCell.style.cursor = "pointer";
				}
			};
			const fillShipPlacement = () => {
				if (!allShipsPlaced) {
					const l = shipLengths[currShipsPlaced];
					if (g1.canPlace(x, y, l, horizontalPlacement)) {
						if (horizontalPlacement) {
							for (let currX = x; currX < x + l; currX += 1) {
								const otherCell = board1.querySelector(
									`[data-x="${currX}"][data-y="${y}"]`
								);
								otherCell.classList.add(`ship${currShipsPlaced + 1}`);
							}
						} else {
							for (let currY = y; currY < y + l; currY += 1) {
								const otherCell = board1.querySelector(
									`[data-x="${x}"][data-y="${currY}"]`
								);
								otherCell.classList.add(`ship${currShipsPlaced + 1}`);
							}
						}
					} else cell.style.cursor = "not-allowed";
				}
			};
			cell.onmouseenter = fillShipPlacement;
			cell.onmouseleave = clearShipPlacement;
			cell.onclick = () => {
				if (allShipsPlaced) return;
				const l = shipLengths[currShipsPlaced];
				if (g1.canPlace(x, y, l, horizontalPlacement)) {
					g1.placeShip(l, [y, x], horizontalPlacement);
					fillShipPlacement();
					currShipsPlaced += 1;
					if (currShipsPlaced === shipLengths.length) {
						allShipsPlaced = true;
						tips.textContent = "Try to hit the enemy ships on the right board!";
						board2.classList.remove("invalid");
						axisBtn.style.display = "none";
					}
				}
			};
			cell.ontouchstart = () => {
				if (allShipsPlaced) return;
				const l = shipLengths[currShipsPlaced];
				if (g1.canPlace(x, y, l, horizontalPlacement)) {
					g1.placeShip(l, [y, x], horizontalPlacement);
					visualizeShip(g1, x, y);
					currShipsPlaced += 1;
					if (currShipsPlaced === shipLengths.length) {
						allShipsPlaced = true;
						tips.textContent = "Try to hit the enemy ships on the right board!";
						board2.classList.remove("invalid");
						axisBtn.style.display = "none";
					}
				}
			};
		}
	};

	const clean = () => {
		board1.innerHTML = "";
		board2.innerHTML = "";
		resetBtn.classList.remove("visible");
	};

	const displayEndMessage = (msg) => {
		document.getElementById("endmsg").textContent = msg;
		endgameModal.style.display = "block";
	};

	resetBtn.onclick = () => {
		endgameModal.style.display = "none";
		clean();
		reset();
	};

	return {
		initializeBoards,
		set attackFollowUp(cb) {
			attackFollowUp = cb;
		},
		set attackAction(cb) {
			attackAction = cb;
		},
		visualizeShot,
		clean,
		displayEndMessage,
		set reset(cb) {
			reset = cb;
		},
	};
};

export default DOM;
