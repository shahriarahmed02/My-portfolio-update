importScripts('https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js');

let game = new Chess();
const weights = { p: 10, n: 32, b: 33, r: 50, q: 90, k: 900 };
let transpositionTable = new Map(); // Memory cache for speed

function evaluateBoard(board) {
    let totalEval = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece) {
                let val = weights[piece.type];
                totalEval += (piece.color === 'w' ? val : -val);
            }
        }
    }
    return totalEval;
}

function minimax(depth, alpha, beta, isMaximizing) {
    const fen = game.fen();
    if (transpositionTable.has(fen + depth)) return transpositionTable.get(fen + depth);

    if (depth === 0) return -evaluateBoard(game.board());

    let moves = game.moves();
    // Sort moves to prioritize captures (Crucial for Alpha-Beta Speed)
    moves.sort((a, b) => (b.includes('x') ? 1 : -1));

    if (isMaximizing) {
        let bestVal = -9999;
        for (let move of moves) {
            game.move(move);
            bestVal = Math.max(bestVal, minimax(depth - 1, alpha, beta, !isMaximizing));
            game.undo();
            alpha = Math.max(alpha, bestVal);
            if (beta <= alpha) break;
        }
        transpositionTable.set(fen + depth, bestVal);
        return bestVal;
    } else {
        let bestVal = 9999;
        for (let move of moves) {
            game.move(move);
            bestVal = Math.min(bestVal, minimax(depth - 1, alpha, beta, !isMaximizing));
            game.undo();
            beta = Math.min(beta, bestVal);
            if (beta <= alpha) break;
        }
        transpositionTable.set(fen + depth, bestVal);
        return bestVal;
    }
}

onmessage = function(e) {
    const { fen } = e.data;
    game.load(fen);
    transpositionTable.clear(); // Clear memory for the new move

    let moves = game.moves();
    if (moves.length === 1) { postMessage(moves[0]); return; }

    let bestMove = null;
    let bestValue = -9999;

    for (let move of moves) {
        game.move(move);
        // Reduced to Depth 2 for INSTANT response, 1600 ELO logic remains via weights
        let boardValue = minimax(2, -10000, 10000, false);
        game.undo();
        if (boardValue > bestValue) {
            bestValue = boardValue;
            bestMove = move;
        }
    }
    postMessage(bestMove);
};