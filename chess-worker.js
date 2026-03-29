importScripts('https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js');

let game = new Chess();
const weights = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const pst = {
    p: [[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]],
    n: [[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,5,5,0,-20,-40],[-30,5,10,15,15,10,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,10,15,15,10,0,-30],[-40,-20,0,0,0,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
    b: [[-20,-10,-10,-10,-10,-10,-10,-20],[-10,5,0,0,0,0,5,-10],[-10,10,10,10,10,10,10,-10],[-10,0,10,10,10,10,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,5,10,10,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
    r: [[0,0,0,5,5,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],
    q: [[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[0,0,5,5,5,5,0,-5],[-5,0,5,5,5,5,0,-5],[-10,0,5,5,5,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]],
    k: [[20,30,10,0,0,10,30,20],[20,20,0,0,0,0,20,20],[-10,-20,-20,-20,-20,-20,-20,-10],[-20,-30,-30,-40,-40,-30,-30,-20],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30]]
};

let startTime = 0;
let currentTimeLimit = 3000; 
let ponderedBestMove = null;

function orderMoves(moves) {
    return moves.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        if (a.captured) scoreA += 10 * weights[a.captured]; 
        if (b.captured) scoreB += 10 * weights[b.captured];
        if (a.promotion) scoreA += 500;
        if (b.promotion) scoreB += 500;
        return scoreB - scoreA;
    });
}

function evaluateBoard() {
    let totalEval = 0;
    const board = game.board();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece) {
                let val = weights[piece.type];
                val += (piece.color === 'w' ? pst[piece.type][i][j] : pst[piece.type][7-i][j]);
                totalEval += (piece.color === 'w' ? val : -val);
            }
        }
    }
    return totalEval;
}

function minimax(depth, alpha, beta, isMaximizing) {
    if (Date.now() - startTime > currentTimeLimit) return isMaximizing ? -50000 : 50000;
    if (depth === 0) return evaluateBoard();

    let moves = orderMoves(game.moves({ verbose: true }));
    if (moves.length === 0) {
        if (game.in_checkmate()) return isMaximizing ? -1000000 : 1000000;
        return 0;
    }

    if (isMaximizing) {
        let bestVal = -1000000;
        for (let move of moves) {
            game.move(move);
            bestVal = Math.max(bestVal, minimax(depth - 1, alpha, beta, false));
            game.undo();
            alpha = Math.max(alpha, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    } else {
        let bestVal = 1000000;
        for (let move of moves) {
            game.move(move);
            bestVal = Math.min(bestVal, minimax(depth - 1, alpha, beta, true));
            game.undo();
            beta = Math.min(beta, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    }
}

onmessage = function(e) {
    const { fen, timeLimit, mode } = e.data;
    
    if (mode === 'search' && ponderedBestMove && game.fen() === fen) {
        postMessage(ponderedBestMove);
        ponderedBestMove = null;
        return;
    }

    game.load(fen);
    startTime = Date.now();
    currentTimeLimit = (mode === 'ponder') ? 999999 : (timeLimit || 3000); 

    let moves = orderMoves(game.moves({ verbose: true }));
    if (moves.length === 0) return;

    let globalBestMove = moves[0].san;
    let isWhite = game.turn() === 'w';

    for (let depth = 1; depth <= 4; depth++) { 
        if (Date.now() - startTime > (currentTimeLimit * 0.9)) break; 
        
        let bestMove = null;
        let bestValue = isWhite ? -1000000 : 1000000;

        for (let move of moves) {
            if (Date.now() - startTime > currentTimeLimit) break;
            
            game.move(move);
            let boardValue = minimax(depth - 1, -1000000, 1000000, !isWhite);
            game.undo();

            if (isWhite) {
                if (boardValue > bestValue) {
                    bestValue = boardValue;
                    bestMove = move.san;
                } else if (boardValue === bestValue && Math.random() > 0.6) {
                    bestMove = move.san; 
                }
            } else {
                if (boardValue < bestValue) {
                    bestValue = boardValue;
                    bestMove = move.san;
                } else if (boardValue === bestValue && Math.random() > 0.6) {
                    bestMove = move.san;
                }
            }
        }
        if (bestMove) globalBestMove = bestMove;
    }

    if (mode === 'ponder') {
        ponderedBestMove = globalBestMove;
    } else {
        postMessage(globalBestMove);
        ponderedBestMove = null;
    }
};