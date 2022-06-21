'use strict';

// all DOM/UI access
const displayController = (function () {

    const PLAYER = 'X';
    const AI = 'O';

    // cache DOM referances
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const message = document.getElementById('message');
    const gameTypes = document.getElementsByName('gameType');

    // event bindings
    cells.forEach(cell => {
        cell.addEventListener('click', leftClick);
        cell.addEventListener('contextmenu', rightClick);
    });
    resetButton.addEventListener('click', resetClick);
    gameTypes.forEach(gameType => {
        gameType.addEventListener('change', gameTypeChange);
    });

    function leftClick(e) {
        e.preventDefault();
        if (e.button !== 0)
            return;
        updateCell(e.target, PLAYER);
        playAI();
    }

    function rightClick(e) {
        e.preventDefault();
        if (e.button !== 2)
            return;
        if (!gameLogic.isSolo())
            return;
        updateCell(e.target, AI);
    }

    function resetClick(e) {
        gameLogic.reset();
    }

    function gameTypeChange(e) {
        gameLogic.setGameType(e.target.value);
    }


    function updateCell(cell, value) {
        if (gameLogic.isGameOver()) {
            alert('Reset to play again');
            return;
        }

        // prevent overwrite cell
        if (cell.innerText)
            return;

        cell.innerText = value;
        gameLogic.executeTurn(cell.dataset.cellnum, value);
    }

    function playAI() {
        const cellnum = gameLogic.getAIcellnum();
        if (cellnum !== 0)
            updateCell(getCell(cellnum), AI);
    }

    function getGameType() {
        for (let i = 0; i < gameTypes.length; i++) {
            if (gameTypes[i].checked)
                return gameTypes[i].value;
        }
        return null;
    }

    function renderBoard() {
        cells.forEach(cell => {
            cell.innerText = gameData.getCell(cell.dataset.cellnum);
        });
    }

    function getCell(cellnum) {
        let ret = null;

        cells.forEach(cell => {
            if (cell.dataset.cellnum == cellnum)
                ret = cell;
        });

        return ret;
    }


    function setMessage(msg) {
        // TODO: there has to be a better way of doing this
        // prevent empty p tag from making stuff shift on screen
        if (!msg) {
            message.innerHTML = '&nbsp;';
            return;
        }
        message.innerText = msg;
    }

    return {
        setMessage,
        getGameType,
        renderBoard
    }
})();

const gameLogic = (function () {

    // avoid hardcoded crap, have to match html values
    const GAME_TYPES = {
        USER: 'self',
        STUPID: 'random',
        SMART: 'cpu'
    };

    // read default from screen on load
    let gameType = displayController.getGameType();
    let isGameOverFlag = false;

    function reset() {
        isGameOverFlag = false
        gameData.clear();
        displayController.setMessage('');
        displayController.renderBoard();
    }

    function executeTurn(cellnum, value) {

        gameData.setCell(cellnum, value);

        if (gameData.hasWinner()) {
            isGameOverFlag = true;
            displayController.setMessage(`${value} Wins!`);
            return;
        }

        if (gameData.isBoardFull()) {
            isGameOverFlag = true;
            displayController.setMessage(`Tie`);
            return;
        }
    }

    function setGameType(value) {
        gameType = value;
        reset();
    }

    function isSolo() {
        return (gameType === GAME_TYPES.USER);
    }

    function isStupid() {
        return (gameType === GAME_TYPES.STUPID);
    }

    function isSmart() {
        return (gameType === GAME_TYPES.SMART);
    }

    function isGameOver() {
        return isGameOverFlag;
    }

    function getAIcellnum() {

        if (isSolo() || isGameOver())
            return 0;

        // find empty data cells
        const emptyCellnums = gameData.getEmptycellnums();
        if (emptyCellnums.length === 0)
            return 0;

        if (isStupid()) {
            const index = getRandomInt(0, emptyCellnums.length);
            const cellnum = emptyCellnums[index];
            return cellnum
        }

        if (isSmart()) {
            // TODO: haven't looked into the AI yet
            // https://en.wikipedia.org/wiki/Minimax
            alert('Not smart yet');
        }

        return 0;
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    return {
        executeTurn,
        reset,
        setGameType,
        isSolo,
        isGameOver,
        getAIcellnum
    }
})();

// TODO: idealy the data would be represented by a grid API, but i want to move on
// cells are numbered 1 to 9, because in the html emmit starts at 1
const gameData = (function () {
    const data = Array(9).fill(null);

    function dumpData() {
        console.clear();
        data.forEach(element => console.log(element));
    }

    function clear() {
        data.fill(null);
    }

    function setCell(cellnum, value) {
        data[cellnum - 1] = value;
    }

    function getCell(cellnum) {
        return data[cellnum - 1];
    }

    function getEmptycellnums() {
        const result = [];

        data.forEach((element, index) => {
            if (element === null)
                result.push(index + 1);
        });

        return result;
    }

    // TODO: a bunch of bad code
    // i have dualing concepts, started with UI as a list of cells, then game logic as a grid, 
    // all the hard coded numbers for translating index to row/col
    function hasWinner() {
        let isSomethingFull = false;

        isSomethingFull |= isRowFull(1) || isRowFull(2) || isRowFull(3);
        isSomethingFull |= isColFull(1) || isColFull(2) || isColFull(3);
        isSomethingFull |= isDiagFull();

        return isSomethingFull;
    }

    function isBoardFull() {
        for (let i = 0; i < data.length; i++)
            if (data[i] === null)
                return false;
        return true;
    }

    function isRowFull(row) {
        const index = (row - 1) * 3;
        if (data[index] == null)
            return false;
        return ((data[index] === data[index + 1]) && (data[index] === data[index + 2]));
    }

    function isColFull(col) {
        const index = (col - 1);
        if (data[index] == null)
            return false;
        return ((data[index] === data[index + 3]) && (data[index] === data[index + 6]));
    }

    function isDiagFull() {
        if (data[0] != null)
            if ((data[0] === data[4]) && (data[0] === data[8]))
                return true;
        if (data[2] != null)
            if ((data[2] === data[4]) && (data[2] === data[6]))
                return true;
        return false;
    }

    return {
        clear,
        setCell,
        getCell,
        hasWinner,
        isBoardFull,
        getEmptycellnums
    }
})();

