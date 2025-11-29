// Client-side puzzle data - fetched from server
// The solution order is NEVER available on the client

let puzzleData = null;

export const dailyPuzzle = {
    // Must be called before using other methods
    async load() {
        if (puzzleData) return puzzleData;

        try {
            // In production, this calls the serverless function
            // In development, we use a fallback
            const response = await fetch('/api/puzzle');
            if (response.ok) {
                puzzleData = await response.json();
                return puzzleData;
            }
        } catch (e) {
            console.log('API not available, using fallback');
        }

        // Fallback for local development without server
        puzzleData = this._getFallbackPuzzle();
        return puzzleData;
    },

    _getFallbackPuzzle() {
        // Only used for local testing - in production, API provides this
        const words = ["ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "DOWN", "FALL", "OUT", "BREAK", "FAST", "BALL", "POINT", "BLANK", "SUN"];
        const pairs = [];
        for (let i = 0; i < words.length; i++) {
            pairs.push(`${words[i]}+${words[(i + 1) % words.length]}`);
        }
        // Shuffle for fallback
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        return {
            puzzleNumber: 1,
            words: shuffled,
            validPairs: pairs.sort(() => Math.random() - 0.5),
            date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        };
    },

    getValidPairs() {
        if (!puzzleData) throw new Error('Puzzle not loaded. Call load() first.');
        return new Set(puzzleData.validPairs);
    },

    getJumbledWords() {
        if (!puzzleData) throw new Error('Puzzle not loaded. Call load() first.');
        return [...puzzleData.words];
    },

    getDateString() {
        if (!puzzleData) return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        return puzzleData.date;
    },

    getPuzzleNumber() {
        if (!puzzleData) return 1;
        return puzzleData.puzzleNumber;
    },

    // For showing solution on loss - reconstruct from valid pairs
    getSolutionForDisplay() {
        if (!puzzleData) return [];
        // We can reconstruct the chain from valid pairs
        const pairs = puzzleData.validPairs;
        const pairMap = new Map();

        for (const pair of pairs) {
            const [a, b] = pair.split('+');
            pairMap.set(a, b);
        }

        // Start from any word and follow the chain
        const words = puzzleData.words;
        let current = words[0];
        const solution = [current];

        while (solution.length < 16) {
            const next = pairMap.get(current);
            if (!next || solution.includes(next)) break;
            solution.push(next);
            current = next;
        }

        return solution;
    }
};
