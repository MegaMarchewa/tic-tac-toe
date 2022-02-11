'use strict';
window.addEventListener('DOMContentLoaded', () => {
    let tiles;
    let timeid;
    let boardSize;
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset'); 
    const announcer = document.querySelector('.announcer');
    const title = document.querySelector('.display'); 
    const boardElement = document.querySelector('#board');
    let turn = document.querySelector('#turn');
    /**
     * @var {HTMLInputElement} input 
     */
    let input = document.querySelector('#input'); 
    let inputButton = document.querySelector('#inputButton');
    let headerInfo = document.querySelector('#headerInfo'); 
    let menu = document.querySelector('#menu');
    let board = [];
    let currentPlayer = 'X'; 
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON'; 
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    
    /*
        Indexes within the board
        [ 0] [ 1]  [ 2] [ 3]
        [ 4] [ 5]  [ 6] [ 7]
        [ 8] [ 9]  [10] [11]
        [12] [13]  [14] [15] 
    */

    // const winningConditions = [
    //     [0, 1, 2, 3],
    //     [4, 5, 6, 7],
    //     [8, 9, 10, 11],
    //     [12,13,14,15],
    //     [0, 4, 8, 12],
    //     [1, 5, 9, 13],
    //     [2, 6, 10, 14],
    //     [3, 7, 11, 15],
    //     [0, 5, 10, 15],
    //     [3, 6, 9, 12]

    // ];

    function startGame(){
        let boardSize = Number.parseInt(input.value);
        if (boardSize < 3) {
            headerInfo.textContent = 'Plansza mniejsza od 3';
            if(timeid != undefined) clearTimeout(timeid);
            timeid = setTimeout(() => {
                headerInfo.textContent = 'Jak dużą planszę chcesz stworzyć?'; 
                timeid = undefined;
            }, 2000);
            return;
        };
        if(!input.value.match(/[0-9]/g)){
        headerInfo.textContent = 'Podaj prawidłową liczbę';
        if(timeid != undefined) clearTimeout(timeid);
        timeid = setTimeout(() => {
            headerInfo.textContent = 'Jak dużą planszę chcesz stworzyć?'; 
            timeid = undefined;
        }, 2000);
        return;
        }
        menu.classList.add('hide');
        generateBoard(boardSize);
    }

    function generateBoard(size) {
        boardSize = size;
        boardElement.innerHTML = '';
        let str = '';
        const percentage = 1/size;
        for(let i = 0; i < size; i++)
            str += `${percentage * 100}% `;
        boardElement.style.gridTemplateColumns = boardElement.style.gridTemplateRows = str;
        for(let i = 0; i < size*size; i++){
            board.push(0);
            let div = document.createElement('div');
            div.addEventListener('click', () => userAction(div, i));
            div.classList.add('tile');
            boardElement.appendChild(div);
            turn.classList.remove('hide');
        }
    }

    inputButton.addEventListener('click', startGame);
    input.addEventListener('keydown', e => {if(e.key == 'Enter') startGame();});
    
    function handleResultValidation() {
        // let roundWon = false;
        // for (let i = 0; i <= 9; i++) {
        //     const winCondition = winningConditions[i];
        //     const a = board[winCondition[0]];
        //     const b = board[winCondition[1]];
        //     const c = board[winCondition[2]];
        //     const d = board[winCondition[3]];
        //     if (a === '' || b === '' || c === '' || d === '') {
        //         continue;
        //     }
        //     if (a === b && b === c && c === d) {
        //         roundWon = true;
        //         break;
        //     }
        // }

        // if (roundWon) {
        //         announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
        //         isGameActive = false;
        //         document.body.style.backgroundImage = 'url(\'assets/img/cat_background.jpg\')'
        //         return;
        //     }

        // if (!board.includes(''))
        //     announce(TIE);
    
        let row, col, diagonal1, diagonal2;
        diagonal1 = diagonal2 = 0;

        for(let i = 0; i < boardSize; i++) {

            row = col = 0;

            for(let j = 0; j < boardSize; j++) {

                row += board[i * boardSize + j];
                col += board[j * boardSize + i];

            }

            if(determineWinner(row)) return;

            if(determineWinner(col)) return;

        }

        for(let i = 0; i < boardSize; i++) {

            diagonal1 += board[i * boardSize + i];
            diagonal2 += board[i * boardSize + boardSize - i - 1];

        }

        if(determineWinner(diagonal1)) return;

        if(determineWinner(diagonal2)) return;

        if(board.every(e => e != 0)) {
            end('tie');
            return;
        }
    
    }

    function determineWinner(points) {

        switch(points) {
    
            case boardSize:
                end('O');
                return 1;
            
            case -boardSize:
                end('X');
                return 1;
    
            default:
                return 0;
    
        }
    
    }

    function end(player) {

        document.body.classList.add('kot-wygrana');

        if(player === 'tie') {
            announce(TIE);
            return;
        }

        announce(player === 'X' ? PLAYERX_WON : PLAYERO_WON);
        isGameActive = false;

    }

    const announce = (type) => {
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = 'Gracz <span class="playerO">O</span> wygrał!! ;ooo';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Gracz <span class="playerX">X</span> wygrał!! ;ooo';
                break;
            case TIE:
                announcer.innerText = 'Remis ;((';   
        }
        announcer.classList.remove('hide');
        title.classList.add('hide');
        turn.classList.add('hide');
    };

    const isValidAction = index => {
        if (board[index])
            return false;

        return true;
    };

    const updateBoard =  (index) => {
        switch(currentPlayer) {

            case 'O':
                board[index] = 1;
                break;

            case 'X':
                board[index] = -1;
                break;
            
        }
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => {
        if(isValidAction(index) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
            console.log(tile, index, board);
        }
    }
    
    const resetBoard = () => {
        document.body.classList.remove('kot-wygrana');
        boardElement.innerHTML='';
        board = [];
        isGameActive = true;
        announcer.classList.add('hide');
        title.classList.remove('hide');
        turn.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    resetButton.addEventListener('click', resetBoard);
});
