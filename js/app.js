'use strict'

const MINE_IMG = '<img src="img/mine.png"/>'
const ONE_IMG = '<img src="img/1.png"/>'
const TWO_IMG = '<img src="img/2.png"/>'
const THREE_IMG = '<img src="img/3.png"/>'

var gBoard
var gNextId = 0
var gLivesCounter = 3
var gElSelected
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gElInit = document.querySelector('.play-again')

//This is called when page loads
function initGame() {
    supportLevel1()
    gGame.isOn = true
    gElInit.innerText = '😀'
    gElInit.hidden = false
}

//Support 3 levels of the game:
//Beginner (4*4 with 2 MINES)
function supportLevel1() {
    var elLevel1 = document.querySelector('.level1')
    if (elLevel1.innerText === 'Beginner') {
        gLevel.size = 4
        gLevel.mines = 2
    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    addMines()
    setMinesNegsCount(gBoard)
}

//Medium (8 * 8 with 12 MINES)
function supportLevel2() {
    var elLevel2 = document.querySelector('.level2')
    if (elLevel2.innerText === 'Medium') {
        gLevel.size = 8
        gLevel.mines = 12
    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    addMines()
    setMinesNegsCount(gBoard)
}

//Expert (12 * 12 with 30 MINES)
function supportLevel3() {
    var elLevel3 = document.querySelector('.level3')
    if (elLevel3.innerText === 'Expert') {
        gLevel.size = 12
        gLevel.mines = 30
    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    addMines()
    setMinesNegsCount(gBoard)
}

function buildBoard() {
    // Create the Matrix
    var board = createMat(gLevel.size, gLevel.size)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Each cell:
            var cell = {
                id: gNextId++,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            // Add created cell to The game board
            board[i][j] = cell
        }
    }
    // Place 2 mines manually
    // board[1][1].gameElement = MINE
    // board[0][1].gameElement = MINE
    console.table(board)
    return board
}

//Randomly locate the mines on the board
function addMines() {
    var randLocations = []
    for (var Idx = 0; Idx < gLevel.mines; Idx++) {
        randLocations.push(getEmptyCell())
        var cell = gBoard[randLocations[Idx].i][randLocations[Idx].j]
        gBoard[randLocations[Idx].i][randLocations[Idx].j].isMine = true
    }
    console.log(randLocations)
}

//set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            cell.minesAroundCount = minesNegsCount(board, i, j)
        }
    }
}

//Count mines around each cell
function minesNegsCount(board, rowIdx, colIdx) {
    var minesCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j]
            if (cell.isMine) minesCount++
        }
    }
    return minesCount
}

// Render the board to an HTML table
function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            var className = (currCell.isShown) ? 'open' : 'close'
            strHTML += `\t<td class="cell ${className}" onclick="cellClicked(this, ${i}, ${j})"  oncontextmenu="cellMarked(this, ${i}, ${j})" >\n`
            if (currCell.isShown) {
                if (currCell.isMine) {
                    strHTML += MINE_IMG
                } else if (currCell.minesAroundCount === 0) {
                    strHTML = strHTML
                } else if (currCell.minesAroundCount === 1) {
                    strHTML += ONE_IMG
                } else if (currCell.minesAroundCount === 2) {
                    strHTML += TWO_IMG
                } else if (currCell.minesAroundCount === 3) {
                    strHTML += THREE_IMG
                } else {
                    strHTML += currCell.minesAroundCount
                }
            }
            if (currCell.isMarked) strHTML += '🚩'
            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

//Called when a cell (td) is clicked.
function cellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    cell.isShown = true
    gGame.shownCount++
    if (cell.isMarked) return
    if (cell.minesAroundCount === 0 && !cell.isMine) expandShown(gBoard, i, j)
    if (!cell.isMine) checkGameOver()
    if (cell.isMine) {
        expandMines(gBoard)
        console.log('Game Over')
        gGame.isOn = false
        gElInit.innerText = '😣'
        gElSelected = (gElSelected !== elCell) ? elCell : null
    } else if (gElSelected && !gGame.isOn) {
        gElSelected.classList.display = none
    }
    var elLives = document.querySelector('.counter-lives')
    if (!gGame.isOn) {
        gLivesCounter--
        if (gLivesCounter == 2) {
            elLives.innerText = '❤❤'
        } else if (gLivesCounter == 1) {
            elLives.innerText = '❤'
        } else if (gLivesCounter == 0) {
            elLives.innerText = '⛔'
            gElInit.hidden = true
        }
    }
    renderBoard()
}

//Called on right click to mark a cell (suspected to be a mine)
function cellMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    cell.isMarked = !cell.isMarked
    gGame.markedCount++
    renderBoard()
}

//Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if ((cell.isMine && !cell.isMarked) || (cell.isMine && cell.isShown) || (!cell.isMine && !cell.isShown)) return
        }
    }
    console.log('Wining')
    gElInit.innerText = '😎'
}

//When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors. 
function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j]
            if (!cell.isShown) {
                cell.isShown = true
                gGame.shownCount++
            }
        }
    }
}

// reveal the mine clicked and mines around
function expandMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (cell.isMine) cell.isShown = true
        }
    }
}

function getEmptyCell() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.innerHTML) {
                emptyCells.push({ i, j })
            }
        }
    }
    var randCellIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randCellIdx]
}


