import "./style.scss";

const DOM = (g1, g2) => {
	const board1 = document.getElementById("board-1");
	const board2 = document.getElementById("board-2");
	const endgameModal = document.getElementById("endgame");
	const resetBtn = document.getElementById("reset");
	let attackFollowUp = () => {};
	let attackAction = () => {};
	let reset = () => {};

	const visualizeShip = (board, x, y) => {
		let otherX = Number(x);
		let otherY = Number(y);
		const sunkShip = board.shipPos[y][x];
		while (
			otherX < board.shipPos.length &&
			board.shipPos[y][otherX] === sunkShip
		) {
			const shipCell = board2.querySelector(
				`[data-x="${otherX}"][data-y="${y}"]`
			);
			shipCell.classList.add(`ship`);
			shipCell.classList.add(`ship${1 + (sunkShip.id % 5)}`);
			otherX += 1;
		}
		otherX = Number(x) - 1;
		while (otherX >= 0 && board.shipPos[y][otherX] === sunkShip) {
			const shipCell = board2.querySelector(
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
			const shipCell = board2.querySelector(
				`[data-x="${x}"][data-y="${otherY}"]`
			);
			shipCell.classList.add(`ship`);
			shipCell.classList.add(`ship${1 + (sunkShip.id % 5)}`);
			otherY += 1;
		}
		otherY = Number(y) - 1;
		while (otherY >= 0 && board.shipPos[otherY][x] === sunkShip) {
			const shipCell = board2.querySelector(
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
		if (board === board2) {
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

	const initializeBoards = (ofSize) => {
		for (let i = 0; i < ofSize; i += 1) {
			for (let j = 0; j < ofSize; j += 1) {
				board1.appendChild(createCell(g1, j, i));
				board2.appendChild(createCell(g2, j, i));
			}
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
