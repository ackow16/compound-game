import { dailyPuzzle } from './data.js?v=28';
import { WORD_COUNT } from './config.js';

export class Game {
    constructor() {
        this.slots = new Array(WORD_COUNT).fill(null); // Array of strings or null
        this.pool = dailyPuzzle.getJumbledWords();
        this.validPairs = dailyPuzzle.getValidPairs();
        this.lives = 3;
        this.gameState = 'playing'; // 'playing', 'won', 'lost'
        this.validPairSlots = new Set(); // Slots that are part of a valid adjacent pair
        this.lastSubmittedSlots = JSON.stringify(this.slots); // Track last submission to prevent duplicates
    }

    // Attempt to place a word in a slot
    placeWord(word, slotIndex) {
        if (this.gameState !== 'playing') return;

        // If slot is occupied, we swap or return to pool? 
        // For MVP: If slot occupied, swap with the word in hand (if dragging) or return old word to pool.
        // Let's assume the UI handles the "swap" logic by removing the old word first.

        // Remove word from pool if it was there
        const poolIndex = this.pool.indexOf(word);
        if (poolIndex > -1) {
            this.pool.splice(poolIndex, 1);
        }

        // If word was in another slot, clear that slot
        const oldSlotIndex = this.slots.indexOf(word);
        if (oldSlotIndex > -1) {
            this.slots[oldSlotIndex] = null;
        }

        // If target slot has a word, move it back to pool (simple swap logic for now)
        if (this.slots[slotIndex]) {
            this.pool.push(this.slots[slotIndex]);
        }

        this.slots[slotIndex] = word;
        // No auto win check anymore
    }

    // Return word to pool
    returnToPool(word) {
        if (this.gameState !== 'playing') return;

        const slotIndex = this.slots.indexOf(word);
        if (slotIndex > -1) {
            this.slots[slotIndex] = null;
        }
        if (!this.pool.includes(word)) {
            this.pool.push(word);
        }
    }

    checkPair(wordA, wordB) {
        if (!wordA || !wordB) return false;
        // Check both directions for flexibility in MVP, or strictly one way.
        // The user said "sequence is right in general", implying direction matters but starting point doesn't.
        // However, for side validation, we just need the pairs to be valid neighbors.
        return this.validPairs.has(`${wordA}+${wordB}`) || this.validPairs.has(`${wordB}+${wordA}`);
    }

    submitGuess() {
        if (this.gameState !== 'playing') return null;

        // Check if all slots are empty - don't count as attempt
        const filledSlots = this.slots.filter(s => s !== null).length;
        console.log('submitGuess called, filledSlots:', filledSlots, 'lives:', this.lives);

        if (filledSlots === 0) {
            console.log('Returning no_change - no slots filled');
            return 'no_change';
        }

        // Check if slots have changed since last submission
        const currentSlotsStr = JSON.stringify(this.slots);
        if (this.lastSubmittedSlots === currentSlotsStr) {
            console.log('Returning no_change - slots unchanged');
            return 'no_change';
        }
        this.lastSubmittedSlots = currentSlotsStr;
        console.log('Processing actual guess, will decrement lives if wrong');

        // Check all adjacent pairs around the ring
        // Pairs: 0-1, 1-2, 2-3, ... (WORD_COUNT-2)-(WORD_COUNT-1), (WORD_COUNT-1)-0
        const newValidPairSlots = new Set();
        let validPairCount = 0;

        for (let i = 0; i < WORD_COUNT; i++) {
            const nextIdx = (i + 1) % WORD_COUNT;
            if (this.checkPair(this.slots[i], this.slots[nextIdx])) {
                newValidPairSlots.add(i);
                newValidPairSlots.add(nextIdx);
                validPairCount++;
            }
        }

        // Check if we made progress (found new valid pairs)
        const hadValidPairs = this.validPairSlots.size > 0;
        const hasMoreValidPairs = newValidPairSlots.size > this.validPairSlots.size;
        this.validPairSlots = newValidPairSlots;

        // Win if all pairs are valid
        if (validPairCount === WORD_COUNT) {
            this.gameState = 'won';
            return 'won';
        } else {
            this.lives--;
            if (this.lives <= 0) {
                this.gameState = 'lost';
                return 'lost';
            }
            // Progress if we have any valid pairs
            return newValidPairSlots.size > 0 ? 'progress' : 'incorrect';
        }
    }

    // Get hint - reveals some correct words (scaled to word count)
    getHint() {
        if (this.gameState !== 'playing') return null;

        const solution = dailyPuzzle.getSolutionForDisplay();
        if (!solution || solution.length !== WORD_COUNT) return null;

        // Number of words to reveal (4 for 16-word, 3 for 12-word)
        const revealCount = WORD_COUNT === 12 ? 3 : 4;

        // Find slots that need help (empty or have wrong word)
        const needsHelp = (slotIndex) => {
            const currentWord = this.slots[slotIndex];
            const correctWord = solution[slotIndex];
            return currentWord !== correctWord;
        };

        // Priority 1: Corner slots (evenly distributed around the ring)
        const cornerSpacing = Math.floor(WORD_COUNT / 4);
        const corners = [0, cornerSpacing, cornerSpacing * 2, cornerSpacing * 3].filter(i => i < WORD_COUNT);
        const cornersNeedingHelp = corners.filter(needsHelp);

        let slotsToFill = [];

        if (cornersNeedingHelp.length >= revealCount) {
            // Fill corners that need help
            slotsToFill = cornersNeedingHelp.slice(0, revealCount);
        } else if (cornersNeedingHelp.length > 0) {
            // Fill remaining corners plus some consecutive slots
            slotsToFill = [...cornersNeedingHelp];

            // Find consecutive slots that need help to fill remaining
            for (let i = 0; i < WORD_COUNT && slotsToFill.length < revealCount; i++) {
                if (needsHelp(i) && !slotsToFill.includes(i)) {
                    slotsToFill.push(i);
                }
            }
        } else {
            // All corners correct - find consecutive slots that need help
            for (let start = 0; start < WORD_COUNT; start++) {
                let found = [];
                for (let i = 0; i < revealCount; i++) {
                    const idx = (start + i) % WORD_COUNT;
                    if (needsHelp(idx)) {
                        found.push(idx);
                    }
                }
                if (found.length > slotsToFill.length) {
                    slotsToFill = found;
                }
                if (slotsToFill.length >= revealCount) break;
            }

            // If we couldn't find enough consecutive, just find any
            if (slotsToFill.length < revealCount) {
                slotsToFill = [];
                for (let i = 0; i < WORD_COUNT && slotsToFill.length < revealCount; i++) {
                    if (needsHelp(i)) {
                        slotsToFill.push(i);
                    }
                }
            }
        }

        // If nothing needs help, return null
        if (slotsToFill.length === 0) return null;

        // Place the correct words
        const changes = [];
        for (const slotIndex of slotsToFill) {
            const correctWord = solution[slotIndex];
            const currentWord = this.slots[slotIndex];

            // If slot has a word, return it to pool
            if (currentWord && currentWord !== correctWord) {
                if (!this.pool.includes(currentWord)) {
                    this.pool.push(currentWord);
                }
            }

            // If correct word is elsewhere, remove it from there
            const oldIndex = this.slots.indexOf(correctWord);
            if (oldIndex > -1 && oldIndex !== slotIndex) {
                this.slots[oldIndex] = null;
            }

            // Remove from pool if it's there
            const poolIndex = this.pool.indexOf(correctWord);
            if (poolIndex > -1) {
                this.pool.splice(poolIndex, 1);
            }

            // Place the correct word
            this.slots[slotIndex] = correctWord;
            changes.push({ slot: slotIndex, word: correctWord });
        }

        return changes;
    }
}
