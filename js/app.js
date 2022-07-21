'use strict'

const MINE = 'MINE'


const MINE_IMG = '<img src="img/mine.png"/>'
const ONE_IMG = '<img src="img/1.png"/>'
const TWO_IMG = '<img src="img/2.png"/>'


var gBoard
var gElSelectedCell = null
var gNextId = 0






function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    addMine()
    // addNums()



}

function buildBoard() {
    // Create the Matrix
    var board = createMat(4, 4)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Each cell:
            var cell = {
                id: gNextId++,
                minesCount: 0,
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

function addMine() {
    const randLocation = getEmptyCell()
    const cell = gBoard[randLocation.i][randLocation.j]
    cell.isMine = true
}

// function addMine() {
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard[0].length; j++) {
//             const cell = gBoard[i][j]
//             cell.gameElement = (Math.random() > 0.8) ? MINE : ''
//         }
//     }
//     //MODEL
//     if (cell.gameElement === MINE) cell.isMine = true
//     //DOM
//     if (cell.gameElement === MINE) renderCell(randLocation, MINE_IMG)
// }

function addNums() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var num = setMinesNegsCount(gBoard, i, j)
            const cell = gBoard[i][j]
            if (num === 0) renderCell(i, j, '')
            if (num === 1) renderCell(i, j, ONE_IMG)
            if (num === 2) renderCell(i, j, TWO_IMG)
        }
    }
    //MODEL
    cell.minesCount = num
}

//counting neighbors:
function setMinesNegsCount(board, rowIdx, colIdx) {
    var minesAroundCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j]
            if (cell.isMine) minesAroundCount++
        }
    }
    // if (minesAroundCount === 0) minesAroundCount = ''
    // if (minesAroundCount === 1) minesAroundCount = ONE_IMG 
    // if (minesAroundCount === 2) minesAroundCount = TWO_IMG 
    // console.log(minesAroundCount)
    return minesAroundCount
}

// Render the board to an HTML table
function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            var className = (currCell.isShown) ? 'shown' : ''
            strHTML += `\t<td class="cell ${className}" onclick="cellClicked(this, ${i}, ${j})" >\n`
            if (currCell.isShown) {
                var num = setMinesNegsCount(gBoard, i, j)
                if (currCell.isMine) {
                    strHTML += MINE_IMG
                } else {
                    strHTML += num
                }
            }
            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    //console.log('cell clicked: ', elCell, i, j)
    cell.isShown = true
    renderBoard()
}

function getEmptyCell() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.innerHTML) { // null = false ( not emptyCells)
                emptyCells.push({ i, j })
            }
        }
    }
    var randCellIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randCellIdx]
}



// function renderCell(location, value) {
//     var cellSelector = '.' + getClassName(location)
//     var elCell = document.querySelector(cellSelector)
//     elCell.innerHTML = value
// }

// function getClassName(location) {
//     var cellClass = `cell-${location.i}-${location.j}`
//     return cellClass
// }

// function storeMinesNegsCount(board) {
//     var store = []
//     for (var rowIdx = 0; rowIdx < board.length; rowIdx++) {
//         for (var colIdx = 0; colIdx < board[0].length; colIdx++) {
//             var cell = board[rowIdx][colIdx]
//             if (cell.gameElement === MINE) continue
//             store.push({ cell: { rowIdx, colIdx }, minesCount: setMinesNegsCount(gBoard, rowIdx, colIdx) })
//         }
//     }
//     console.log(store)
//     return store
// }

