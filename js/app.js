import { dailyPuzzle } from './data.js?v=5';
import { Game } from './game.js?v=5';
import { UI } from './ui.js?v=5';

document.addEventListener('DOMContentLoaded', async () => {
    // Load puzzle data from server first
    await dailyPuzzle.load();

    const game = new Game();
    const ui = new UI(game);

    // Expose for debugging
    window.game = game;
    window.ui = ui;
});
