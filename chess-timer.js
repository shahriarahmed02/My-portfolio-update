let playerTime = 600; 
let opponentTime = 600;
let timerInterval = null;
const increment = 3; 

function highlightLosingKing(game, color) {
    const squares = document.querySelectorAll('.square');
    const boardState = game.board();

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = boardState[r][c];
            if (piece && piece.type === 'k' && piece.color === color) {
                const index = r * 8 + c;
                squares[index].classList.add('losing-king');
                return;
            }
        }
    }
}

window.addIncrement = function(color) {
    if (color === 'w') {
        playerTime += increment;
    } else {
        opponentTime += increment;
    }
    updateTimerDisplay();
};

window.checkWinCondition = function(game) {
    if (game.game_over()) {
        if (timerInterval) clearInterval(timerInterval);
        
        let message = "";
        let losingColor = "";

        if (game.in_checkmate()) {
            losingColor = game.turn(); 
            highlightLosingKing(game, losingColor);
            message = losingColor === 'w' ? "Checkmate! Turjo wins! 😈" : "Checkmate! You beat Turjo! 🏆";
        } else if (game.in_draw()) {
            message = "It's a Draw! 🤝";
        }

        setTimeout(() => {
            if (confirm(message + "\n\nWould you like a rematch?")) {
                window.location.reload();
            }
        }, 800);
        return true;
    }
    return false;
};

window.startChessTimer = function(game) {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (game.game_over()) {
            clearInterval(timerInterval);
            return;
        }

        if (game.turn() === 'w') {
            playerTime--;
        } else {
            opponentTime--;
        }

        updateTimerDisplay();

        if (playerTime <= 0 || opponentTime <= 0) {
            clearInterval(timerInterval);
            const loser = playerTime <= 0 ? 'w' : 'b';
            highlightLosingKing(game, loser);
            
            setTimeout(() => {
                alert(playerTime <= 0 ? "Time Out! Turjo wins! ⌛" : "Time Out! You won on time! 🏆");
            }, 500);
        }
    }, 1000);
};

function updateTimerDisplay() {
    const pMin = Math.floor(playerTime / 60);
    const pSec = playerTime % 60;
    const oMin = Math.floor(opponentTime / 60);
    const oSec = opponentTime % 60;

    const pEl = document.getElementById('player-timer');
    const oEl = document.getElementById('opponent-timer');
    
    if(pEl) pEl.innerText = `${pMin}:${pSec < 10 ? '0' : ''}${pSec}`;
    if(oEl) oEl.innerText = `${oMin}:${oSec < 10 ? '0' : ''}${oSec}`;
}

window.resetChessTimer = function() {
    playerTime = 600;
    opponentTime = 600;
    if (timerInterval) clearInterval(timerInterval);
    updateTimerDisplay();
};