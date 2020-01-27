var main;
const human = 'O';
const computer = 'X';
const wins = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const box = document.querySelectorAll('.box');
begin();

function begin() {
	document.querySelector('.final-whistle').style.display = 'none';
	main = Array.from(Array(9).keys());
	for (var i = 0; i < box.length; i++) {
		box[i].innerText = '';
		box[i].style.removeProperty('background-color');
		box[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof main[square.target.id] == 'number') {
		turn(square.target.id, human)
		if (!won(main, human) && !tie()) turn(bestSpot(), computer);
	}
}

function turn(squareId, player) {
	main[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = won(main, player)
	if (gameWon) finalWhistle(gameWon)
}

function won(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of wins.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function finalWhistle(gameWon) {
	for (let index of wins[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == human ? 'purple' : 'red';
	}
	for (var i = 0; i < box.length; i++) {
		box[i].removeEventListener('click', turnClick, false);
	}
	whoWon(gameWon.player == human ? '\uD83D\uDE00 You win!' : 'You Lose!!!');
}

function whoWon(who) {
	document.querySelector('.final-whistle').style.display = 'block';
	document.querySelector('.final-whistle .text').innerText = who;
}

function blankBox() {
	return main.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(main, computer).index;
}

function tie() {
	if (blankBox().length == 0) {
		for (var i = 0; i < box.length; i++) {
			box[i].style.backgroundColor = 'rgb(60, 20, 61)';
			box[i].removeEventListener('click', turnClick, false);
		}
		whoWon('\udd7e-\udd7f Draw!')
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = blankBox();

	if (won(newBoard, human)) {
		return {score: -10};
	} else if (won(newBoard, computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == computer) {
			var result = minimax(newBoard, human);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}