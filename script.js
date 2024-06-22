document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restartButton');
    const message = document.getElementById('message');
    const playerSelect = document.querySelectorAll('input[name="player"]');
    let currentPlayer;
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];

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

        if (gameState[cellIndex] !== '' || !gameActive) {
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
        message.textContent = `Player ${currentPlayer}'s Turn`;
    }

    // Event listener for player selection
    playerSelect.forEach(player => {
        player.addEventListener('change', () => {
            currentPlayer = player.value;
            restartGame(); // Restart game with selected player starting
        });
    });

    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    // Initialize game
    restartGame();
});
