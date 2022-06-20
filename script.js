'use strict';

// all DOM/UI access
const displayController = (function () {

    const PLAYER = 'X';
    const AI = 'O';

    // cache queries
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const message = document.getElementById('message');
    const options = document.getElementsByName('opt');

    // event bindings
    cells.forEach(cell => {
        cell.addEventListener('click', leftClick);
        cell.addEventListener('contextmenu', rightClick);
    });
    resetButton.addEventListener('click', resetClick);
    options.forEach(opt => {
        opt.addEventListener('change', optionChange);
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
        if (!gameLogic.isSoloPlay())
            return;
        updateCell(e.target, AI);
    }

    function updateCell(cell, value) {
        // prevent overwrite cell
        if (cell.innerText)
            return;

        // game over, make them reset
        if (gameLogic.isGameOver()) {
            alert('Reset to play again');
            return;
        }

        cell.innerText = value;
        gameLogic.executeTurn(cell.dataset.cellnum, value);
    }

    // TODO: this should be game logic, but it needs cell
    function playAI() {
        if (gameLogic.isSoloPlay() || gameLogic.isGameOver())
            return;

        // find empty data cells
        const emptyCellnums = gameData.getEmptycellnums();
        if (emptyCellnums.length === 0)
            return;

        // pick one at random and update corresponding UI cell
        const index = getRandomInt(0, emptyCellnums.length);
        const cellnum = emptyCellnums[index];
        updateCell(getCell(cellnum), AI);
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    function resetClick(e) {
        gameLogic.reset();
    }

    function optionChange(e) {
        gameLogic.setGameType(e.target.value);
    }

    function getGameType() {
        for (let i = 0; i < options.length; i++) {
            if (options[i].checked)
                return options[i].value;
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

        if (gameData.isFull()) {
            isGameOverFlag = true;
            displayController.setMessage(`Tie`);
            return;
        }
    }

    function setGameType(value) {
        gameType = value;
        reset();
    }

    function isSoloPlay() {
        return (gameType === 'self');
    }

    function isGameOver() {
        return isGameOverFlag;
    }

    return {
        executeTurn,
        reset,
        setGameType,
        isSoloPlay,
        isGameOver
    }
})();

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
    // should have a better wraper for the data
    // all the hard coded numbers for translating index to row/col

    function hasWinner() {
        let isSomethingFull = false;

        isSomethingFull |= isRowFull(1) || isRowFull(2) || isRowFull(3);
        isSomethingFull |= isColFull(1) || isColFull(2) || isColFull(3);
        isSomethingFull |= isDiagFull();
        return isSomethingFull;
    }

    function isFull() {
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
        isFull,
        getEmptycellnums
    }
})();

