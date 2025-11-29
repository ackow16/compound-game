import { Game } from './game.js?v=4';
import { UI } from './ui.js?v=4';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    const ui = new UI(game);

    // Expose for debugging
    window.game = game;
    window.ui = ui;
});
