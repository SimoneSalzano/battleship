const DOM = (() => {
	const board1 = document.getElementById("board-1");
	const board2 = document.getElementById("board-2");

	const createCell = (ofBoard, x, y) => {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		cell.dataset.x = x;
		cell.dataset.y = y;
		const ship = ofBoard.shipPos[y][x];
		if (ship) {
			cell.classList.add(`ship${(ship.id % 5) + 1}`);
			cell.classList.add(`ship`);
		}
		return cell;
	};

	const initializeBoards = (ofSize, b1, b2) => {
		for (let i = 0; i < ofSize; i += 1) {
			for (let j = 0; j < ofSize; j += 1) {
				board1.appendChild(createCell(b1, i, j));
				board2.appendChild(createCell(b2, i, j));
			}
		}
	};

	return { initializeBoards };
})();

export default DOM;
