const DOM = (p1, p2) => {
	const board1 = document.getElementById("board-1");
	const board2 = document.getElementById("board-2");
	let attackFollowUp = () => {};

	const visualizeShot = (player, result, x, y) => {
		const board = player === p1 ? board2 : board1;
		const target = board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
		const pin = document.createElement("div");
		if (result) {
			if (result === "hit" || result === "sunk") pin.classList.add("hit");
			else pin.classList.add("miss");
			target.appendChild(pin);
		}
	};

	const handleClick = (target, board) => {
		if (board === board2) {
			const { x, y } = target.dataset;
			const result = p1.attack(x, y);
			visualizeShot(p1, result, x, y);
			if (result) attackFollowUp();
		}
	};

	const createCell = (ofBoard, x, y) => {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		cell.dataset.x = x;
		cell.dataset.y = y;
		const ship = ofBoard.shipPos[y][x];
		if (ofBoard === p1.ownGameboard && ship) {
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
				board1.appendChild(createCell(p1.ownGameboard, i, j));
				board2.appendChild(createCell(p2.ownGameboard, i, j));
			}
		}
	};

	return {
		initializeBoards,
		set attackFollowUp(cb) {
			attackFollowUp = cb;
		},
		visualizeShot,
	};
};

export default DOM;
