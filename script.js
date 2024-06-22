
document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restartButton');
    const message = document.getElementById('message');
    const playerSelect = document.querySelectorAll('input[name="player"]');
    const modeSelect = document.querySelectorAll('input[name="mode"]');
    let humanPlayer;
    let aiPlayer;
    let currentPlayer;
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let isHumanVsAI = false;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Function to handle cell click event
    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'));

        if (gameState[cellIndex] !== '' || !gameActive || (isHumanVsAI && currentPlayer === aiPlayer)) {
            return;
        }

        gameState[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.style.color = currentPlayer === 'X' ? '#e74c3c' : '#3498db';

        if (checkWin(currentPlayer)) {
            message.textContent = `Player ${currentPlayer} Wins!`;
            gameActive = false;
            return;
        }

        if (gameState.every(cell => cell !== '')) {
            message.textContent = `It's a Draw!`;
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s Turn`;

        if (isHumanVsAI && currentPlayer === aiPlayer && gameActive) {
            setTimeout(makeAIMove, 500);
        }
    }

    // Function to make AI move
    function makeAIMove() {
        const shouldPlayOptimally = Math.random() < 0.95; // 95% chance to play optimally, 5% chance to play randomly
        const bestMove = shouldPlayOptimally ? getBestMove() : getRandomMove();
        gameState[bestMove.index] = aiPlayer;
        cells[bestMove.index].textContent = aiPlayer;
        cells[bestMove.index].style.color = aiPlayer === 'X' ? '#e74c3c' : '#3498db';

        if (checkWin(aiPlayer)) {
            message.textContent = `AI Wins!`;
            gameActive = false;
            return;
        }

        if (gameState.every(cell => cell !== '')) {
            message.textContent = `It's a Draw!`;
            gameActive = false;
            return;
        }

        currentPlayer = humanPlayer;
        message.textContent = `Player ${humanPlayer}'s Turn`;
    }

    // Function to check for a win
    function checkWin(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] === player && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return true;
            }
        }
        return false;
    }

    // Function to restart the game
    function restartGame() {
        gameActive = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.color = ''; // Reset cell text color
        });
        currentPlayer = playerSelect[0].checked ? 'X' : 'O'; // Start with first player
        humanPlayer = currentPlayer;
        aiPlayer = humanPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s Turn`;

        if (isHumanVsAI && currentPlayer === aiPlayer) {
            setTimeout(makeAIMove, 500); // AI makes the first move if it starts
        }
    }

    // Function to get the best move for AI
    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = aiPlayer;
                let score = minimax(gameState, 0, false);
                gameState[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { index: i, score: score };
                }
            }
        }
        return bestMove;
    }

    // Function to get a random move for AI
    function getRandomMove() {
        const availableMoves = [];
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                availableMoves.push(i);
            }
        }
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return { index: availableMoves[randomIndex] };
    }

    // Minimax function
    function minimax(state, depth, isMaximizing) {
        const scores = { X: 1, O: -1, tie: 0 };

        let result = checkResult();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < state.length; i++) {
                if (state[i] === '') {
                    state[i] = aiPlayer;
                    let score = minimax(state, depth + 1, false);
                    state[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < state.length; i++) {
                if (state[i] === '') {
                    state[i] = humanPlayer;
                    let score = minimax(state, depth + 1, true);
                    state[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    // Function to check the current state of the game
    function checkResult() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] !== '' && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return gameState[a];
            }
        }
        if (gameState.every(cell => cell !== '')) {
            return 'tie';
        }
        return null;
    }

    // Event listener for player selection
    playerSelect.forEach(player => {
        player.addEventListener('change', () => {
            currentPlayer = player.value;
            restartGame(); // Restart game with selected player starting
        });
    });

    // Event listener for mode selection
    modeSelect.forEach(mode => {
        mode.addEventListener('change', () => {
            isHumanVsAI = mode.value === 'ai';
            restartGame(); // Restart game with selected mode
        });
    });

    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    // Initialize game
    restartGame();
});
