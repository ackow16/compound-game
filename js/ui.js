import { dailyPuzzle } from './data.js?v=4';

export class UI {
    constructor(game) {
        this.game = game;

        // DOM Elements
        this.slotsLayer = document.getElementById('slots-layer');
        this.wordPool = document.getElementById('word-pool');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedbackMessage = document.getElementById('feedback-message');
        this.livesContainer = document.getElementById('lives-container');
        this.ringContainer = document.getElementById('ring-container');
        this.dateDisplay = document.getElementById('date-display');
        this.timerDisplay = document.getElementById('timer-display');

        // Start screen
        this.startOverlay = document.getElementById('start-overlay');
        this.startBtn = document.getElementById('start-btn');
        this.startDate = document.getElementById('start-date');

        // Modals
        this.modalOverlay = document.getElementById('modal-overlay');
        this.winModal = document.getElementById('win-modal');
        this.helpOverlay = document.getElementById('help-overlay');

        // Drag state
        this.draggedWord = null;
        this.dragSource = null;
        this.dragElement = null;
        this.ghostElement = null;
        this.isDragging = false;

        // Physics state for smooth drag
        this.mouseX = 0;
        this.mouseY = 0;
        this.ghostX = 0;
        this.ghostY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.animationFrame = null;

        // Timer state
        this.timerInterval = null;
        this.startTime = null;
        this.elapsedTime = 0;

        this.init();
    }

    init() {
        const dateStr = dailyPuzzle.getDateString();
        this.dateDisplay.textContent = dateStr;
        if (this.startDate) {
            this.startDate.textContent = dateStr;
        }

        // Display puzzle number
        const puzzleNumber = document.getElementById('puzzle-number');
        if (puzzleNumber) {
            puzzleNumber.textContent = `Puzzle #${dailyPuzzle.getPuzzleNumber()}`;
        }

        this.createSlots();
        this.setupEventListeners();
        this.render();
    }

    startGame() {
        if (this.startOverlay) {
            this.startOverlay.classList.add('hidden');
        }
        this.startTimer();
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateTimerDisplay();
        }, 100);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    createSlots() {
        const slotPositions = [];
        const size = 5;
        const inset = 3; // Very tight layout - minimal gaps
        const range = 100 - (2 * inset);
        const step = range / (size - 1);

        // Top Row (0-4)
        for (let i = 0; i < 5; i++) {
            slotPositions.push({ x: inset + (i * step), y: inset });
        }
        // Right Col (5-8)
        for (let i = 1; i < 5; i++) {
            slotPositions.push({ x: 100 - inset, y: inset + (i * step) });
        }
        // Bottom Row (9-12)
        for (let i = 1; i < 5; i++) {
            slotPositions.push({ x: (100 - inset) - (i * step), y: 100 - inset });
        }
        // Left Col (13-15)
        for (let i = 1; i < 4; i++) {
            slotPositions.push({ x: inset, y: (100 - inset) - (i * step) });
        }

        slotPositions.forEach((pos, i) => {
            const slot = document.createElement('div');
            slot.classList.add('slot', 'empty');
            slot.dataset.index = i;
            slot.style.left = `${pos.x}%`;
            slot.style.top = `${pos.y}%`;
            slot.style.transform = `translate(-50%, -50%)`;
            this.setupSlotEvents(slot);
            this.slotsLayer.appendChild(slot);
        });
    }

    render() {
        this.renderSlots();
        this.renderPool();
        this.renderLives();

        if (this.game.gameState === 'won') {
            this.stopTimer();
            this.showEndGameButton();
            this.showModal('won');
        } else if (this.game.gameState === 'lost') {
            this.stopTimer();
            this.showSolution();
            this.showEndGameButton();
            this.showModal('lost');
        }
    }

    showEndGameButton() {
        // Replace submit button with share button
        this.submitBtn.textContent = 'Share Result';
        this.submitBtn.onclick = () => this.shareResult();
    }

    showSolution() {
        // Fill slots with the correct solution
        const solution = dailyPuzzle.solution;
        const slotEls = this.slotsLayer.querySelectorAll('.slot');
        slotEls.forEach((el, index) => {
            el.textContent = solution[index];
            el.className = 'slot filled correct-side';
        });
        // Clear the pool
        this.wordPool.innerHTML = '';
    }

    renderSlots() {
        const slotEls = this.slotsLayer.querySelectorAll('.slot');
        slotEls.forEach((el, index) => {
            const word = this.game.slots[index];
            el.textContent = word || '';
            el.className = 'slot';

            if (word) {
                el.classList.add('filled');
            } else {
                el.classList.add('empty');
            }

            if (this.isSlotInSolvedSide(index)) {
                el.classList.add('correct-side');
            }
        });
    }

    isSlotInSolvedSide(index) {
        const sides = {
            top: [0, 1, 2, 3, 4],
            right: [4, 5, 6, 7, 8],
            bottom: [8, 9, 10, 11, 12],
            left: [12, 13, 14, 15, 0]
        };

        for (const [side, indices] of Object.entries(sides)) {
            if (this.game.solvedSides[side] && indices.includes(index)) {
                return true;
            }
        }
        return false;
    }

    renderLives() {
        this.livesContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const pip = document.createElement('span');
            pip.classList.add('life-pip');
            if (i >= this.game.lives) {
                pip.classList.add('lost');
            }
            this.livesContainer.appendChild(pip);
        }
    }

    renderPool() {
        this.wordPool.innerHTML = '';
        this.game.pool.forEach((word) => {
            const wordEl = document.createElement('div');
            wordEl.classList.add('pool-word');
            wordEl.textContent = word;
            this.setupPoolWordEvents(wordEl);
            this.wordPool.appendChild(wordEl);
        });
    }

    // ==================== Physics-Based Drag ====================

    setupSlotEvents(slot) {
        slot.addEventListener('pointerdown', (e) => {
            if (!slot.classList.contains('filled')) return;
            if (this.game.gameState !== 'playing') return;
            e.preventDefault();
            this.startDrag(e, slot.textContent, 'slot', slot);
        });
    }

    setupPoolWordEvents(wordEl) {
        wordEl.addEventListener('pointerdown', (e) => {
            if (this.game.gameState !== 'playing') return;
            e.preventDefault();
            this.startDrag(e, wordEl.textContent, 'pool', wordEl);
        });
    }

    startDrag(e, word, source, element) {
        this.isDragging = true;
        this.draggedWord = word;
        this.dragSource = source;
        this.dragElement = element;

        // Initialize positions
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.ghostX = e.clientX;
        this.ghostY = e.clientY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.velocityX = 0;
        this.velocityY = 0;

        element.classList.add('dragging');

        // Create ghost
        this.createGhost(word, e.clientX, e.clientY);

        // Start physics loop
        this.startPhysicsLoop();

        // Event listeners
        const onMove = (moveEvent) => {
            this.mouseX = moveEvent.clientX;
            this.mouseY = moveEvent.clientY;
            this.updateDragOver(moveEvent.clientX, moveEvent.clientY);
        };

        const onUp = (upEvent) => {
            this.onDragEnd(upEvent);
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
    }

    createGhost(word, x, y) {
        this.ghostElement = document.createElement('div');
        this.ghostElement.classList.add('drag-ghost');
        this.ghostElement.textContent = word;
        this.ghostElement.style.left = `${x}px`;
        this.ghostElement.style.top = `${y}px`;
        document.body.appendChild(this.ghostElement);
    }

    startPhysicsLoop() {
        const animate = () => {
            if (!this.isDragging || !this.ghostElement) return;

            // Calculate velocity for tilt effect
            this.velocityX = this.mouseX - this.lastMouseX;
            this.velocityY = this.mouseY - this.lastMouseY;
            this.lastMouseX = this.mouseX;
            this.lastMouseY = this.mouseY;

            // Spring physics - ghost follows mouse with easing
            const springStrength = 0.25;
            const damping = 0.85;

            const dx = this.mouseX - this.ghostX;
            const dy = this.mouseY - this.ghostY;

            this.ghostX += dx * springStrength;
            this.ghostY += dy * springStrength;

            // Calculate tilt based on velocity (capped)
            const maxTilt = 15;
            const tiltX = Math.max(-maxTilt, Math.min(maxTilt, this.velocityX * 0.8));
            const tiltY = Math.max(-maxTilt, Math.min(maxTilt, -this.velocityY * 0.3));

            // Apply transform with tilt
            this.ghostElement.style.left = `${this.ghostX}px`;
            this.ghostElement.style.top = `${this.ghostY}px`;
            this.ghostElement.style.transform = `translate(-50%, -50%) rotate(${tiltX}deg) scale(1.05)`;

            this.animationFrame = requestAnimationFrame(animate);
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    updateDragOver(x, y) {
        // Clear all drag-over states
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

        // Find element under cursor
        const elementsUnder = document.elementsFromPoint(x, y);
        const slotUnder = elementsUnder.find(el => el.classList.contains('slot'));

        if (slotUnder && slotUnder !== this.dragElement) {
            slotUnder.classList.add('drag-over');
        }
    }

    onDragEnd(e) {
        if (!this.isDragging) return;

        // Stop physics loop
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        // Remove ghost with animation
        if (this.ghostElement) {
            this.ghostElement.style.transition = 'all 0.15s ease-out';
            this.ghostElement.style.opacity = '0';
            this.ghostElement.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                if (this.ghostElement) {
                    this.ghostElement.remove();
                    this.ghostElement = null;
                }
            }, 150);
        }

        // Remove dragging class
        if (this.dragElement) {
            this.dragElement.classList.remove('dragging');
        }

        // Clear drag-over states
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

        // Find drop target
        const elementsUnder = document.elementsFromPoint(e.clientX, e.clientY);
        const slotUnder = elementsUnder.find(el => el.classList.contains('slot'));
        const poolUnder = elementsUnder.find(el =>
            el.classList.contains('pool-container') ||
            el.classList.contains('pool-inner') ||
            el.classList.contains('word-pool')
        );

        if (slotUnder && this.draggedWord) {
            const targetIndex = parseInt(slotUnder.dataset.index);
            this.game.placeWord(this.draggedWord, targetIndex);
            this.render();

            // Pop animation on placed slot
            slotUnder.classList.add('pop');
            setTimeout(() => slotUnder.classList.remove('pop'), 200);
        } else if (poolUnder && this.dragSource === 'slot' && this.draggedWord) {
            this.game.returnToPool(this.draggedWord);
            this.render();
        }

        // Reset state
        this.isDragging = false;
        this.draggedWord = null;
        this.dragSource = null;
        this.dragElement = null;
    }

    // ==================== Event Listeners ====================

    setupEventListeners() {
        // Start button
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        // Submit button
        this.submitBtn.addEventListener('click', () => {
            if (this.game.gameState !== 'playing') return;

            // UI-level check: if no slots filled, just shake - don't call submitGuess
            const filledCount = this.game.slots.filter(s => s !== null).length;
            if (filledCount === 0) {
                this.ringContainer.classList.add('shake');
                setTimeout(() => this.ringContainer.classList.remove('shake'), 400);
                this.feedbackMessage.textContent = 'Place some words first';
                this.feedbackMessage.className = 'feedback-message error';
                setTimeout(() => {
                    this.feedbackMessage.textContent = '';
                    this.feedbackMessage.className = 'feedback-message';
                }, 2000);
                return;
            }

            const result = this.game.submitGuess();
            this.handleSubmitResult(result);
            this.render();
        });

        // Modal close
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            this.modalOverlay.classList.add('hidden');
        });

        // Share button
        document.getElementById('share-btn').addEventListener('click', () => {
            this.shareResult();
        });

        // Help button
        document.getElementById('help-btn').addEventListener('click', () => {
            this.helpOverlay.classList.remove('hidden');
        });

        // Close help
        document.getElementById('close-help-btn').addEventListener('click', () => {
            this.helpOverlay.classList.add('hidden');
        });

        // Click outside modals to close
        this.helpOverlay.addEventListener('click', (e) => {
            if (e.target === this.helpOverlay) {
                this.helpOverlay.classList.add('hidden');
            }
        });

        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.modalOverlay.classList.add('hidden');
            }
        });

        // Prevent context menu during drag
        document.addEventListener('contextmenu', (e) => {
            if (this.isDragging) e.preventDefault();
        });
    }

    handleSubmitResult(result) {
        this.feedbackMessage.textContent = '';
        this.feedbackMessage.className = 'feedback-message';

        if (result === 'no_change') {
            // Just shake - no message, no life lost
            this.ringContainer.classList.add('shake');
            setTimeout(() => this.ringContainer.classList.remove('shake'), 400);
            return;
        } else if (result === 'won') {
            this.feedbackMessage.textContent = 'Perfect!';
            this.feedbackMessage.classList.add('success');
        } else if (result === 'lost') {
            this.feedbackMessage.textContent = 'Game Over';
            this.feedbackMessage.classList.add('error');
        } else if (result === 'progress') {
            this.feedbackMessage.textContent = 'Good progress!';
            this.feedbackMessage.classList.add('success');
        } else if (result === 'incorrect') {
            this.feedbackMessage.textContent = 'Not quite';
            this.feedbackMessage.classList.add('error');

            // Shake animation
            this.ringContainer.classList.add('shake');
            setTimeout(() => this.ringContainer.classList.remove('shake'), 400);
        }
    }

    showModal(type) {
        const modalIcon = document.getElementById('modal-icon');
        const modalTitle = this.winModal.querySelector('.modal-title');
        const modalText = this.winModal.querySelector('.modal-text');

        if (type === 'won') {
            modalIcon.classList.remove('error');
            modalIcon.innerHTML = `
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 24L22 30L32 18" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            modalTitle.textContent = 'Chain Complete';
            modalText.textContent = `Solved in ${this.formatTime(this.elapsedTime)}`;
        } else {
            modalIcon.classList.add('error');
            modalIcon.innerHTML = `
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2"/>
                    <path d="M18 18L30 30M30 18L18 30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                </svg>
            `;
            modalTitle.textContent = 'Game Over';

            // Show the solution as text
            const solution = dailyPuzzle.solution;
            modalText.innerHTML = `
                <div style="margin-bottom: 16px;">The correct chain was:</div>
                <div style="font-size: 0.75rem; line-height: 1.6; color: var(--text-secondary); word-break: break-word;">
                    ${solution.join(' → ')}
                </div>
            `;
        }

        this.renderStats();
        this.modalOverlay.classList.remove('hidden');
    }

    renderStats() {
        const statsSummary = document.getElementById('stats-summary');
        const livesUsed = 3 - this.game.lives;
        const sidesComplete = Object.values(this.game.solvedSides).filter(Boolean).length;

        statsSummary.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${this.formatTime(this.elapsedTime)}</div>
                <div class="stat-label">Time</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${this.game.gameState === 'won' ? livesUsed + 1 : '-'}</div>
                <div class="stat-label">Attempts</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${sidesComplete}/4</div>
                <div class="stat-label">Sides</div>
            </div>
        `;
    }

    async shareResult() {
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const sidesComplete = Object.values(this.game.solvedSides).filter(Boolean).length;

        const sides = ['top', 'right', 'bottom', 'left'];
        const boxes = sides.map(side => this.game.solvedSides[side] ? '\u2588' : '\u2591');

        let resultText = `COMPOUND ${date}\n`;

        if (this.game.gameState === 'won') {
            resultText += `Solved in ${this.formatTime(this.elapsedTime)}\n`;
        } else {
            resultText += `${sidesComplete}/4 sides\n`;
        }

        resultText += boxes.join('') + '\n\n';
        resultText += 'Play free at playcompound.com';

        const shareBtn = document.getElementById('share-btn');
        const shareUrl = 'https://playcompound.com';

        // Try native share API first (mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'COMPOUND - Daily Word Chain Puzzle',
                    text: resultText,
                    url: shareUrl
                });
                return;
            } catch (err) {
                // User cancelled or share failed, fall back to clipboard
                if (err.name === 'AbortError') return; // User cancelled
            }
        }

        // Fallback to clipboard
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(resultText);
                const originalText = shareBtn.textContent;
                shareBtn.textContent = 'Copied!';
                setTimeout(() => {
                    shareBtn.textContent = originalText;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    }
}
