# top-js-tictactoe
The Odin Project, Full Stack JavaScript Path, JavaScript, Organizing your JavaScript Code, Project: Tic Tac Toe


The main goal is to have as little global code as possible; use module and/or factory.

- Using Revealing Module pattern; tried to isolate UI, game logic and data model.  gameData.hasWinner() & gameData.isTie() feel like game logic, but they need data access.
- The page is responsive, but right click breaks in browser tools phone view; for this project I don't care what happens on a phone.
- I'm not doing multiple players, tic tac toe is a bad example for using factory pattern.  Its just you against the AI; or you playing both.  TOP should have a separate project for exercising factories.
- No choice, use left and right mouse for X & O; not interested in doing extra UI work, the module code is what matters.
