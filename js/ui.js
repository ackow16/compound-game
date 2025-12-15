import { dailyPuzzle } from './data.js?v=28';
import { WORD_COUNT } from './config.js';

export class UI {
    constructor(game) {
        this.game = game;

        // DOM Elements
        this.slotsLayer = document.getElementById('slots-layer');
        this.wordPool = document.getElementById('word-pool');
        this.submitBtn = document.getElementById('submit-btn');
        this.hintBtn = document.getElementById('hint-btn');
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
        this.tutorialOverlay = document.getElementById('tutorial-overlay');
        this.tutorialStep = 1;

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
        console.log('UI init started');
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

        // Set up dynamic sizing
        this.calculateLayout();
        window.addEventListener('resize', () => this.calculateLayout());

        this.createSlots();
        this.setupEventListeners();
        this.setupTutorial();
        console.log('UI init complete, startBtn:', this.startBtn);
        this.render();
    }

    setupTutorial() {
        // Hide tutorial initially - it shows after clicking Play
        if (this.tutorialOverlay) {
            this.tutorialOverlay.classList.add('hidden');
        }

        // Tutorial navigation
        const nextBtn = document.getElementById('tutorial-next-btn');
        const dots = document.querySelectorAll('.tutorial-dots .dot');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.tutorialStep < 2) {
                    this.tutorialStep++;
                    this.updateTutorialStep();
                } else {
                    this.closeTutorial();
                }
            });
        }

        // Dot navigation
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                this.tutorialStep = parseInt(dot.dataset.step);
                this.updateTutorialStep();
            });
        });
    }

    updateTutorialStep() {
        const steps = document.querySelectorAll('.tutorial-step');
        const dots = document.querySelectorAll('.tutorial-dots .dot');
        const nextBtn = document.getElementById('tutorial-next-btn');

        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === this.tutorialStep) {
                step.classList.add('active');
            }
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
            if (parseInt(dot.dataset.step) === this.tutorialStep) {
                dot.classList.add('active');
            }
        });

        // Update button text on last step
        if (nextBtn) {
            nextBtn.textContent = this.tutorialStep === 2 ? "Let's Play!" : 'Next';
        }
    }

    closeTutorial() {
        if (this.tutorialOverlay) {
            this.tutorialOverlay.classList.add('hidden');
        }
        // Go directly to the game (skip start screen)
        if (this.startOverlay) {
            this.startOverlay.classList.add('hidden');
        }
        this.startTimer();
    }

    calculateLayout() {
        try {
            const root = document.documentElement;
            const header = document.querySelector('.game-header');
            const footer = document.querySelector('.game-footer');

            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const headerHeight = header ? header.offsetHeight : 80;
            const footerHeight = footer ? footer.offsetHeight : 50;

            // ========== LAYOUT MODE DETECTION ==========
            // Two layout modes:
            // - phone: < 600px width (tall vertical ring for portrait screens)
            // - desktop: >= 600px width (square ring for tablet & desktop)
            const isPhone = viewportWidth < 600;

            // Store layout mode for slot positioning
            this.layoutMode = isPhone ? 'phone' : 'desktop';
            root.style.setProperty('--layout-mode', this.layoutMode);

            // ========== CALCULATE EDGE MARGIN BASED ON SLOT OVERFLOW ==========
            // First estimate ring and slot sizes to determine how much margin we need
            const estimatedRingWidth = Math.min(viewportWidth * 0.9, 800);
            const estimatedSlotWidthRatio = 0.15 + (estimatedRingWidth / 800) * 0.03;
            const estimatedSlotWidth = estimatedRingWidth * estimatedSlotWidthRatio;

            // Slot inset (percentage from ring edge where slot center is)
            const insetFactor = Math.max(0, Math.min(1, (viewportWidth - 280) / 520));
            const slotInsetPercent = 10 - insetFactor * 5; // 10% at 280px, 5% at 800px

            // How far slot extends past ring edge = half slot width - (inset * ring width)
            const slotCenterFromEdge = estimatedRingWidth * (slotInsetPercent / 100);
            const slotOverflow = Math.max(0, (estimatedSlotWidth / 2) - slotCenterFromEdge);

            // Edge margin must be at least slot overflow + buffer
            const minMarginForSlots = slotOverflow + 8;
            // More generous margin in the 550-980px range where max-width doesn't help
            const baseMargin = viewportWidth < 950
                ? 24 + 4000 / viewportWidth  // ~31px at 550px, ~30px at 700px, ~28px at 950px
                : 12 + 4000 / viewportWidth; // Falls off once max-width centering kicks in
            const edgeMargin = Math.max(24, Math.min(50, Math.max(baseMargin, minMarginForSlots)));
            root.style.setProperty('--safe-margin', `${edgeMargin}px`);

            // ========== AVAILABLE SPACE ==========
            const verticalPadding = 16;
            const availableHeight = viewportHeight - headerHeight - footerHeight - verticalPadding;
            const availableWidth = viewportWidth - (2 * edgeMargin);

            // Mobile detection for larger touch targets
            const isMobile = viewportWidth < 600;

            // ========== DYNAMIC ASPECT RATIO ==========
            // Aspect ratios depend on both device and word count
            // Phone: tall vertical rectangle, Desktop/Tablet: nearly square
            const screenRatio = availableWidth / availableHeight;
            let aspectRatio;

            if (isPhone) {
                // Phone mode - tall vertical ring
                if (WORD_COUNT === 12) {
                    // 12-word phone: 2x5 layout - target ~2.5 (5/2)
                    aspectRatio = Math.max(2.0, Math.min(2.8, 2.5 - (screenRatio - 0.4) * 0.3));
                } else {
                    // 16-word phone: 3x7 layout - target ~2.33 (7/3)
                    if (screenRatio < 0.4) {
                        aspectRatio = 2.0 + (0.4 - screenRatio) * 0.5;
                    } else {
                        aspectRatio = 2.2 - (screenRatio - 0.4) * 0.3;
                    }
                    aspectRatio = Math.max(1.8, Math.min(2.5, aspectRatio));
                }
            } else {
                // Desktop/Tablet mode - nearly square ring
                // Both 12-word (4x4) and 16-word (5x5) use similar square proportions
                if (screenRatio < 0.5) {
                    aspectRatio = 0.95 + (0.5 - screenRatio) * 1.0;
                } else {
                    const clampedRatio = Math.min(1.5, screenRatio);
                    aspectRatio = 0.95 - (clampedRatio - 0.5) * 0.27;
                }
            }

            // ========== RING SIZE WITH SAFETY ==========
            let ringWidth = Math.min(availableWidth, 800);
            let ringHeight = ringWidth * aspectRatio;

            if (ringHeight > availableHeight) {
                ringHeight = availableHeight;
                ringWidth = ringHeight / aspectRatio;
            }

            // Minimum ring - on mobile, need larger ring to fit larger slots
            // Allow ring to exceed viewport on mobile for better touch targets
            const minRingForMobile = isMobile ? 280 : 220;
            const safeMinRing = isMobile ? minRingForMobile : Math.min(220, availableWidth);
            ringWidth = Math.max(ringWidth, safeMinRing);
            ringHeight = Math.max(ringHeight, safeMinRing * aspectRatio);

            // ========== SLOT SIZE - PROPORTIONAL ==========
            // Adjust slot size based on layout mode and word count
            let slotWidthRatio, slotHeightRatio, minSlotWidth, minSlotHeight;

            if (isPhone) {
                // Phone: tall vertical ring - slots around perimeter
                if (WORD_COUNT === 12) {
                    // 12-word: 2x5 layout - very wide slots
                    slotWidthRatio = 0.28 + (ringWidth / 400) * 0.04;
                    slotHeightRatio = 0.10 + (ringHeight / 800) * 0.02;
                } else {
                    // 16-word: 3x7 layout - slightly smaller to give pool more room
                    slotWidthRatio = 0.24 + (ringWidth / 400) * 0.03;
                    slotHeightRatio = 0.075 + (ringHeight / 800) * 0.02;
                }
                minSlotWidth = 62;
                minSlotHeight = 34;
            } else {
                // Desktop/Tablet: square ring - nice rectangular slots
                slotWidthRatio = 0.15 + (ringWidth / 800) * 0.03;
                slotHeightRatio = 0.11 + (ringHeight / 600) * 0.03;
                minSlotWidth = isMobile ? 54 : 36;
                minSlotHeight = isMobile ? 40 : 28;
            }

            const slotWidth = Math.max(minSlotWidth, ringWidth * slotWidthRatio);
            const slotHeight = Math.max(minSlotHeight, ringHeight * slotHeightRatio);

            // ========== SLOT INSET - CONTINUOUS ==========
            // Use the slotInsetPercent calculated earlier for margin
            const slotInset = slotInsetPercent;
            root.style.setProperty('--slot-inset', slotInset);

            // Arrow insets - separate X and Y for non-square layouts (3x7 phone)
            const arrowInsetX = slotInset + (slotWidth / ringWidth) * 50 + 2;
            const arrowInsetY = slotInset + (slotHeight / ringHeight) * 50 + 2;
            root.style.setProperty('--arrow-inset-x', `${arrowInsetX}%`);
            root.style.setProperty('--arrow-inset-y', `${arrowInsetY}%`);

            // ========== POOL SIZE ==========
            const slotOverlapH = (slotWidth / ringWidth) * 50;
            const slotOverlapV = (slotHeight / ringHeight) * 50;
            const poolMargin = isPhone ? 4 : 2;

            const availablePoolWidth = ringWidth * (1 - 2 * (slotInset + slotOverlapH + poolMargin) / 100);
            const availablePoolHeight = ringHeight * (1 - 2 * (slotInset + slotOverlapV + poolMargin) / 100);

            let poolWidth, poolHeight;
            if (isPhone) {
                // Phone mode: bigger pool for larger word boxes
                const maxPoolWidth = ringWidth * 0.70;
                poolWidth = Math.max(130, Math.min(maxPoolWidth, availablePoolWidth * 1.1));
                poolHeight = Math.max(220, availablePoolHeight * 0.95);
            } else {
                // Desktop/Tablet mode: balanced pool for 4-column grid
                poolWidth = Math.max(80, availablePoolWidth * 0.95);
                poolHeight = Math.max(60, availablePoolHeight * 0.95);
            }

            // ========== SET CSS VARIABLES ==========
            root.style.setProperty('--ring-width', `${ringWidth}px`);
            root.style.setProperty('--ring-height', `${ringHeight}px`);
            root.style.setProperty('--slot-width', `${slotWidth}px`);
            root.style.setProperty('--slot-height', `${slotHeight}px`);
            root.style.setProperty('--pool-width', `${poolWidth}px`);
            root.style.setProperty('--pool-height', `${poolHeight}px`);

            // ========== FONT SIZES - CONTINUOUS ==========
            // Slot font: increased minimums for better mobile readability
            const minSlotFontSize = isMobile ? 0.55 : 0.45;
            const slotFontSize = Math.max(minSlotFontSize, Math.min(1.35, 0.45 + (slotWidth - 36) * 0.9 / 134));
            root.style.setProperty('--slot-font-size', `${slotFontSize}rem`);

            // Pool font: scale aggressively with pool width to prevent text wrapping
            // Increased mobile minimum for better readability
            const poolWidthFactor = poolWidth / 160;
            const poolHeightFactor = poolHeight / 180;
            const poolFontFactor = Math.min(poolWidthFactor, poolHeightFactor, slotWidth / 80);
            const minPoolFontSize = isMobile ? 0.75 : 0.4;
            const poolFontSize = Math.max(minPoolFontSize, Math.min(1.1, 0.4 + poolFontFactor * 0.6));
            root.style.setProperty('--pool-font-size', `${poolFontSize}rem`);

            // Pool word sizing - scale with pool dimensions
            // Increased mobile minimum heights for better touch and readability
            const minPoolWordHeight = isMobile ? 52 : 24;
            const poolWordHeight = Math.max(minPoolWordHeight, Math.min(70, Math.min(poolHeight * 0.16, poolWidth * 0.11)));
            const poolWordPadV = Math.max(8, Math.min(14, poolHeight * 0.03));
            const poolWordPadH = Math.max(6, Math.min(10, poolWidth * 0.015));
            root.style.setProperty('--pool-word-height', `${poolWordHeight}px`);
            root.style.setProperty('--pool-word-pad-v', `${poolWordPadV}px`);
            root.style.setProperty('--pool-word-pad-h', `${poolWordPadH}px`);
        } catch (e) {
            console.error('Layout calculation error:', e);
        }
    }

    startGame() {
        console.log('startGame called');
        if (this.startOverlay) {
            this.startOverlay.classList.add('hidden');
        }
        // Show tutorial after clicking Play
        if (this.tutorialOverlay) {
            this.tutorialStep = 1;
            this.updateTutorialStep();
            this.tutorialOverlay.classList.remove('hidden');
        }
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
        this.updateSlotPositions();
        window.addEventListener('resize', () => this.updateSlotPositions());
    }

    updateSlotPositions() {
        // Clear existing slots or create if needed
        const currentSlotCount = this.slotsLayer.children.length;
        if (currentSlotCount !== WORD_COUNT) {
            // Recreate slots if count changed
            this.slotsLayer.innerHTML = '';
            for (let i = 0; i < WORD_COUNT; i++) {
                const slot = document.createElement('div');
                slot.classList.add('slot', 'empty');
                slot.dataset.index = i;
                slot.style.transform = `translate(-50%, -50%)`;
                this.setupSlotEvents(slot);
                this.slotsLayer.appendChild(slot);
            }
        }

        // Get inset from CSS variable (set by calculateLayout)
        const insetStr = getComputedStyle(document.documentElement).getPropertyValue('--slot-inset');
        const inset = parseFloat(insetStr) || 7; // Percentage from edge

        const slotPositions = [];
        const layoutMode = this.layoutMode || 'desktop';

        if (WORD_COUNT === 12) {
            // ========== 12-WORD LAYOUTS ==========
            if (layoutMode === 'phone') {
                // Phone 12-word: 2x5 layout
                // Distribution: Top: 2, Right: 4, Bottom: 2, Left: 4 = 12 slots
                const hRange = 100 - (2 * inset);
                const vRange = 100 - (2 * inset);
                const hStep = hRange / 1; // 2 slots across = 1 gap
                const vStep = vRange / 4; // 5 slots down = 4 gaps

                // Top Row (0-1): 2 slots
                for (let i = 0; i < 2; i++) {
                    slotPositions.push({ x: inset + (i * hStep), y: inset });
                }
                // Right Col (2-5): 4 slots
                for (let i = 1; i <= 4; i++) {
                    slotPositions.push({ x: 100 - inset, y: inset + (i * vStep) });
                }
                // Bottom Row (6-7): 2 slots (going left)
                for (let i = 1; i <= 2; i++) {
                    slotPositions.push({ x: (100 - inset) - (i * hStep), y: 100 - inset });
                }
                // Left Col (8-11): 4 slots (going up, skip bottom-left since it's counted)
                for (let i = 1; i <= 4; i++) {
                    slotPositions.push({ x: inset, y: (100 - inset) - (i * vStep) });
                }
            } else {
                // Desktop/Tablet 12-word: 4x4 layout (nearly square, symmetric)
                // Distribution: Top: 4, Right: 3, Bottom: 3, Left: 2 = 12 slots
                const range = 100 - (2 * inset);
                const step = range / 3; // 4 slots per side = 3 gaps

                // Top Row (0-3): 4 slots
                for (let i = 0; i < 4; i++) {
                    slotPositions.push({ x: inset + (i * step), y: inset });
                }
                // Right Col (4-6): 3 slots
                for (let i = 1; i <= 3; i++) {
                    slotPositions.push({ x: 100 - inset, y: inset + (i * step) });
                }
                // Bottom Row (7-9): 3 slots (going left)
                for (let i = 1; i <= 3; i++) {
                    slotPositions.push({ x: (100 - inset) - (i * step), y: 100 - inset });
                }
                // Left Col (10-11): 2 slots (going up)
                for (let i = 1; i <= 2; i++) {
                    slotPositions.push({ x: inset, y: (100 - inset) - (i * step) });
                }
            }
        } else {
            // ========== 16-WORD LAYOUTS ==========
            if (layoutMode === 'phone') {
                // Phone 16-word: 3x7 layout
                // Distribution: Top: 3, Right: 6, Bottom: 2, Left: 5 = 16 slots
                const hRange = 100 - (2 * inset);
                const vRange = 100 - (2 * inset);
                const hStep = hRange / 2; // 3 slots across = 2 gaps
                const vStep = vRange / 6; // 7 slots down = 6 gaps

                // Top Row (0-2): 3 slots
                for (let i = 0; i < 3; i++) {
                    slotPositions.push({ x: inset + (i * hStep), y: inset });
                }
                // Right Col (3-8): 6 slots
                for (let i = 1; i <= 6; i++) {
                    slotPositions.push({ x: 100 - inset, y: inset + (i * vStep) });
                }
                // Bottom Row (9-10): 2 slots
                for (let i = 1; i <= 2; i++) {
                    slotPositions.push({ x: (100 - inset) - (i * hStep), y: 100 - inset });
                }
                // Left Col (11-15): 5 slots
                for (let i = 1; i <= 5; i++) {
                    slotPositions.push({ x: inset, y: (100 - inset) - (i * vStep) });
                }
            } else {
                // Desktop/Tablet 16-word: 5x5 layout (square, symmetric)
                // Distribution: Top: 5, Right: 4, Bottom: 4, Left: 3 = 16 slots
                const range = 100 - (2 * inset);
                const step = range / 4; // 5 slots per side = 4 gaps

                // Top Row (0-4): 5 slots
                for (let i = 0; i < 5; i++) {
                    slotPositions.push({ x: inset + (i * step), y: inset });
                }
                // Right Col (5-8): 4 slots
                for (let i = 1; i < 5; i++) {
                    slotPositions.push({ x: 100 - inset, y: inset + (i * step) });
                }
                // Bottom Row (9-12): 4 slots
                for (let i = 1; i < 5; i++) {
                    slotPositions.push({ x: (100 - inset) - (i * step), y: 100 - inset });
                }
                // Left Col (13-15): 3 slots
                for (let i = 1; i < 4; i++) {
                    slotPositions.push({ x: inset, y: (100 - inset) - (i * step) });
                }
            }
        }

        // Apply positions
        const slots = this.slotsLayer.querySelectorAll('.slot');
        slots.forEach((slot, i) => {
            if (slotPositions[i]) {
                slot.style.left = `${slotPositions[i].x}%`;
                slot.style.top = `${slotPositions[i].y}%`;
            }
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
        const solution = dailyPuzzle.getSolutionForDisplay();
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

            if (this.game.validPairSlots.has(index)) {
                el.classList.add('correct-side');
            }
        });
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

        // Capture pointer to ensure we receive all events (important for mobile)
        if (element.setPointerCapture) {
            element.setPointerCapture(e.pointerId);
        }
        this.currentPointerId = e.pointerId;

        // Prevent page scrolling during drag
        document.body.classList.add('dragging');

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
            document.removeEventListener('pointercancel', onUp);
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
        document.addEventListener('pointercancel', onUp);
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

        // Release pointer capture
        if (this.dragElement && this.dragElement.releasePointerCapture && this.currentPointerId) {
            try {
                this.dragElement.releasePointerCapture(this.currentPointerId);
            } catch (ex) {
                // Pointer may already be released
            }
        }
        this.currentPointerId = null;

        // Re-enable page scrolling
        document.body.classList.remove('dragging');

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
        // Safety cleanup for stuck drag states (mobile fallback)
        document.addEventListener('touchend', () => {
            if (this.isDragging) {
                this.onDragEnd({ clientX: this.mouseX, clientY: this.mouseY });
            }
        }, { passive: true });

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

        // Hint button
        if (this.hintBtn) {
            this.hintBtn.addEventListener('click', () => {
                this.useHint();
            });
        }

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

    useHint() {
        if (this.game.gameState !== 'playing') return;
        // Give hint directly (no ads for now)
        this.grantHint();
    }

    grantHint() {
        const changes = this.game.getHint();

        if (!changes || changes.length === 0) {
            // All slots already correct
            this.feedbackMessage.textContent = 'No hints needed!';
            this.feedbackMessage.className = 'feedback-message success';
            setTimeout(() => {
                this.feedbackMessage.textContent = '';
                this.feedbackMessage.className = 'feedback-message';
            }, 2000);
            return;
        }

        // Show feedback
        this.feedbackMessage.textContent = `Revealed ${changes.length} words`;
        this.feedbackMessage.className = 'feedback-message success';
        setTimeout(() => {
            this.feedbackMessage.textContent = '';
            this.feedbackMessage.className = 'feedback-message';
        }, 2000);

        // Re-render
        this.render();

        // Add pop animation to the revealed slots
        const slotEls = this.slotsLayer.querySelectorAll('.slot');
        changes.forEach(change => {
            const slotEl = slotEls[change.slot];
            if (slotEl) {
                slotEl.classList.add('pop');
                setTimeout(() => slotEl.classList.remove('pop'), 200);
            }
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
            const solution = dailyPuzzle.getSolutionForDisplay();
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
        const validPairsCount = this.countValidPairs();

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
                <div class="stat-value">${validPairsCount}/${WORD_COUNT}</div>
                <div class="stat-label">Pairs</div>
            </div>
        `;
    }

    countValidPairs() {
        let count = 0;
        for (let i = 0; i < WORD_COUNT; i++) {
            const nextIdx = (i + 1) % WORD_COUNT;
            if (this.game.validPairs.has(`${this.game.slots[i]}+${this.game.slots[nextIdx]}`) ||
                this.game.validPairs.has(`${this.game.slots[nextIdx]}+${this.game.slots[i]}`)) {
                count++;
            }
        }
        return count;
    }

    async shareResult() {
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const validPairsCount = this.countValidPairs();

        let resultText = `COMPOUND ${date}\n`;

        if (this.game.gameState === 'won') {
            resultText += `Solved in ${this.formatTime(this.elapsedTime)}\n`;
        } else {
            resultText += `${validPairsCount}/${WORD_COUNT} pairs\n`;
        }

        resultText += '\n';
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
