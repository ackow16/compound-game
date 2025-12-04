import { dailyPuzzle } from './data.js?v=14';

export class Game {
    constructor() {
        this.slots = new Array(16).fill(null); // Array of strings or null
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

        // Check all 16 adjacent pairs around the ring
        // Pairs: 0-1, 1-2, 2-3, ... 14-15, 15-0
        const newValidPairSlots = new Set();
        let validPairCount = 0;

        for (let i = 0; i < 16; i++) {
            const nextIdx = (i + 1) % 16;
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

        // Win if all 16 pairs are valid
        if (validPairCount === 16) {
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
}
