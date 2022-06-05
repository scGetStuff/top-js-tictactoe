'use strict';

const domStuff = (function () {

    // only want to select things once 
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');

    // event bindings
    cells.forEach(cell => {
        cell.addEventListener('click', leftClick);
        cell.addEventListener('contextmenu', rightClick);
    });
    resetButton.addEventListener('click', resetClick);


    function leftClick(e) {
        if (e.button !== 0)
            return;
        e.preventDefault();
        displayController.setCell(e.target, 'X');
    }

    function rightClick(e) {
        if (e.button !== 2)
            return;
        e.preventDefault();
        displayController.setCell(e.target, 'O');
    }

    function resetClick(e) {
        gameBoard.clear();
        displayController.renderBoard();
    }

    return {
        cells
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

    return {
        dumpData,
        clear,
        setCell,
        getCell
    }
})();

const displayController = (function () {

    function renderBoard() {
        domStuff.cells.forEach(cell => {
            cell.innerText = gameBoard.getCell(cell.dataset.cellnum);
        });
    }

    function setCell(cell, value) {
        cell.innerText = value;
        gameBoard.setCell(cell.dataset.cellnum, value);
    }

    return {
        renderBoard,
        setCell
    }

})();
