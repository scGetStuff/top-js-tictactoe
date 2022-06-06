'use strict';


const domStuff = (function () {

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
    options.forEach(cell => {
        cell.addEventListener('change', optionChange);
    });

    function leftClick(e) {
        if (e.button !== 0)
            return;
        e.preventDefault();
        displayController.setCell(e.target, 'X');
    }

    function rightClick(e) {
        if (e.button !== 2)
            return;
        if (!displayController.isSoloPlay())
            return;
        e.preventDefault();
        displayController.setCell(e.target, 'O');
    }

    function resetClick(e) {
        displayController.reset();
    }

    function optionChange(e) {
        displayController.changeOption(e.target);
    }

    function getGameType() {
        for (let i = 0; i < options.length; i++) {
            if (options[i].checked)
                return options[i].value;
        }
        return null;
    }

    return {
        cells,
        message,
        getGameType
    }
})();


const displayController = (function () {

    // read default from screen on load
    let gameType = domStuff.getGameType();
    let isGameOver = false;

    function renderBoard() {
        domStuff.cells.forEach(cell => {
            cell.innerText = gameBoard.getCell(cell.dataset.cellnum);
        });
    }

    function setMessage(msg) {
        // TODO: there has to be a better way of doing this
        // prevent empty p tag from making stuff shift on screen
        if (!msg) {
            domStuff.message.innerHTML = '&nbsp;';
            return;
        }
        domStuff.message.innerText = msg;
    }

    function reset() {
        isGameOver = false
        gameBoard.clear();
        setMessage('');
        renderBoard();
    }

    function setCell(cell, value) {
        // prevent overwrite cell
        if (cell.innerText)
            return;

        // game over, make them reset
        if (isGameOver) {
            alert('Reset to play again');
            return;
        }

        cell.innerText = value;
        gameBoard.setCell(cell.dataset.cellnum, value);
        // TODO: more stupid looking code, maybe i will fix it, maybe i will not care and move on to better backend stuff
        if (gameBoard.hasWinner()) {
            isGameOver = true;
            setMessage(`${value} Wins!`);
            return;
        }
        if (gameBoard.isTie()) {
            isGameOver = true;
            setMessage(`Tie`);
            return;
        }
    }

    function changeOption(opt) {
        gameType = opt.value;
        reset();
    }

    function isSoloPlay() {
        return (gameType === 'self');
    }

    return {
        renderBoard,
        setCell,
        setMessage,
        reset,
        changeOption,
        isSoloPlay
    }
})();


const gameBoard = (function () {
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

    // TODO: could i have made this any worse?
    // copy paste looking crap, there is probably a better way 
    // should have an api to translate grid cordinate to array index, 
    // but all i need is the row/col check, so first pass half ass it
    function hasWinner() {
        let isSomethingFull = false;

        isSomethingFull |= isRowFull(1) || isRowFull(2) || isRowFull(3);
        isSomethingFull |= isColFull(1) || isColFull(2) || isColFull(3);
        isSomethingFull |= isDiagFull();
        return isSomethingFull;
    }

    function isTie() {
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

    // so fucking bad
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
        isTie
    }
})();

// the project indicats that this should be a thing
// i don't see it, i probalby have too much shit in the other modules
const game = (function () {

    function stuff() {

    }

    return {
        stuff
    }
})();
