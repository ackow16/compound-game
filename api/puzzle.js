// Serverless function to return daily puzzle data
// The solution order is NEVER sent to the client

const puzzles = [
    // Puzzle 1: SUNROOM loops back
    ["ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "DOWN", "FALL", "OUT", "BREAK", "FAST", "BALL", "POINT", "BLANK", "SUN"],
    // Puzzle 2: FIRELIGHT loops back
    ["LIGHT", "HOUSE", "WORK", "SHOP", "LIFT", "OFF", "HAND", "SHAKE", "DOWN", "POUR", "RAIN", "COAT", "RACK", "BALL", "ROOM", "FIRE"],
    // Puzzle 3: MOONBEAM loops back
    ["BEAM", "LIGHT", "YEAR", "BOOK", "WORM", "HOLE", "PUNCH", "LINE", "BACK", "BONE", "DRY", "CLEAN", "SWEEP", "STAKE", "OUT", "MOON"],
    // Puzzle 4: STARFISH loops back
    ["FISH", "BOWL", "CUT", "BACK", "YARD", "BIRD", "HOUSE", "WIFE", "LIFE", "BOAT", "LOAD", "STONE", "WALL", "FLOWER", "BED", "STAR"],
    // Puzzle 5: WATERFALL loops back
    ["FALL", "OUT", "BREAK", "DOWN", "TOWN", "HOUSE", "HOLD", "UP", "LIFT", "OFF", "HAND", "MADE", "OVER", "NIGHT", "MARE", "WATER"],
    // Puzzle 6: SNOWBALL loops back
    ["BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "BOX", "CAR", "POOL", "SIDE", "WALK", "OUT", "DOOR", "SNOW"],
    // Puzzle 7: GOLDFISH loops back
    ["FISH", "POND", "LIFE", "LINE", "BACK", "FIRE", "FLY", "PAPER", "WORK", "BENCH", "MARK", "DOWN", "HILL", "TOP", "COAT", "GOLD"],
    // Puzzle 8: SUNFLOWER loops back
    ["FLOWER", "BED", "ROOM", "SERVICE", "MARK", "UP", "TOWN", "SHIP", "SHAPE", "SHIFT", "WORK", "LOAD", "STAR", "LIGHT", "BULB", "SUN"],
    // Puzzle 9: FIREWOOD loops back
    ["WOOD", "LAND", "LORD", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "OUT", "SIDE", "LINE", "DRIVE", "WAY", "FARE", "FIRE"],
    // Puzzle 10: MOONSHINE loops back
    ["SHINE", "LIGHT", "HOUSE", "BOAT", "YARD", "BIRD", "BRAIN", "STORM", "CLOUD", "BURST", "OUT", "BREAK", "FAST", "BALL", "GAME", "MOON"],
    // Puzzle 11-100 continue...
    ["FALL", "BACK", "PACK", "RAT", "RACE", "TRACK", "BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "DOWN", "RAIN"],
    ["QUAKE", "PROOF", "READ", "OUT", "DOOR", "BELL", "HOP", "SCOTCH", "TAPE", "WORM", "WOOD", "WORK", "SHOP", "LIFT", "OFF", "EARTH"],
    ["BIRD", "HOUSE", "HOLD", "BACK", "BONE", "HEAD", "LIGHT", "WEIGHT", "LIFT", "OFF", "HAND", "SHAKE", "DOWN", "TOWN", "SHIP", "BLACK"],
    ["BIRD", "BATH", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "LIFT", "OFF", "BEAT", "BOX", "CAR", "POOL", "HALL", "BLUE"],
    ["FIRE", "FLY", "PAPER", "BACK", "YARD", "BIRD", "BRAIN", "WAVE", "POOL", "SIDE", "WALK", "OUT", "BREAK", "DOWN", "FALL", "WILD"],
    ["FIRE", "SIDE", "LINE", "BACK", "BONE", "DRY", "CLEAN", "UP", "BEAT", "DOWN", "POUR", "RAIN", "DROP", "KICK", "STAND", "CAMP"],
    ["PRINT", "OUT", "BREAK", "FAST", "BALL", "GAME", "PLAN", "LAND", "LORD", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "FOOT"],
    ["BEAT", "DOWN", "FALL", "OUT", "SIDE", "STEP", "SON", "LIGHT", "HOUSE", "WIFE", "LIFE", "LINE", "BACK", "FIRE", "FLY", "HEART"],
    ["FALL", "BACK", "HAND", "SHAKE", "DOWN", "TOWN", "HOUSE", "BOAT", "LOAD", "STAR", "FISH", "BOWL", "CUT", "THROAT", "COAT", "NIGHT"],
    ["LIGHT", "YEAR", "BOOK", "MARK", "DOWN", "HILL", "SIDE", "KICK", "STAND", "POINT", "BLANK", "CHECK", "MATE", "SHIP", "YARD", "DAY"],
    ["FLAKE", "OUT", "BREAK", "DOWN", "LOAD", "STONE", "WALL", "PAPER", "BACK", "BONE", "HEAD", "LIGHT", "HOUSE", "WORK", "SHOP", "SNOW"],
    ["BURN", "OUT", "DOOR", "BELL", "BOY", "FRIEND", "SHIP", "YARD", "STICK", "UP", "BEAT", "DOWN", "FALL", "BACK", "FIRE", "SUN"],
    ["MILL", "STONE", "WALL", "FLOWER", "BED", "ROOM", "MATE", "SHIP", "SHAPE", "UP", "TOWN", "HOUSE", "HOLD", "BACK", "PACK", "WIND"],
    ["BACK", "YARD", "BIRD", "HOUSE", "WORK", "LOAD", "STAR", "LIGHT", "BULB", "HEAD", "LINE", "DRIVE", "WAY", "SIDE", "SADDLE", "HORSE"],
    ["BOARD", "WALK", "OUT", "SIDE", "LINE", "BACK", "PACK", "RAT", "RACE", "CAR", "POOL", "HALL", "MARK", "DOWN", "TOWN", "KEY"],
    ["BOARD", "GAME", "PLAN", "LAND", "LORD", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "SHAKE", "DOWN", "FALL", "OUT", "CUP"],
    ["BALL", "POINT", "BLANK", "CHECK", "BOOK", "WORM", "HOLE", "PUNCH", "LINE", "UP", "BEAT", "BOX", "CAR", "WASH", "OUT", "BASE"],
    ["BALL", "ROOM", "SERVICE", "MARK", "DOWN", "POUR", "RAIN", "COAT", "RACK", "BALL", "GAME", "SHOW", "DOWN", "HILL", "TOP", "FOOT"],
    ["BALL", "GAME", "PLAN", "LAND", "SLIDE", "SHOW", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "LIFT", "OFF", "HAND", "BASKET"],
    ["WORK", "SHOP", "LIFT", "OFF", "SHORE", "LINE", "BACK", "FIRE", "SIDE", "WALK", "OUT", "DOOR", "BELL", "HOP", "SCOTCH", "HOME"],
    ["WORK", "BENCH", "MARK", "DOWN", "TOWN", "HOUSE", "BOAT", "YARD", "BIRD", "BRAIN", "STORM", "CLOUD", "BURST", "OUT", "BREAK", "CLOCK"],
    ["WORK", "LOAD", "STAR", "LIGHT", "HOUSE", "HOLD", "UP", "BEAT", "DOWN", "FALL", "OUT", "SIDE", "LINE", "DRIVE", "WAY", "NET"],
    ["WORK", "FORCE", "FIELD", "GOAL", "POST", "CARD", "BOARD", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "BOX", "TEAM"],
    ["WORK", "OUT", "BREAK", "FAST", "FOOD", "CHAIN", "LINK", "UP", "TOWN", "SHIP", "YARD", "BIRD", "HOUSE", "WIFE", "LIFE", "FRAME"],
    ["WORM", "HOLE", "PUNCH", "BOWL", "CUT", "BACK", "YARD", "SALE", "TAX", "FREE", "HAND", "OUT", "DOOR", "STEP", "SON", "BOOK"],
    ["WORM", "WOOD", "LAND", "LORD", "SHIP", "YARD", "STICK", "UP", "LIFT", "OFF", "HAND", "SHAKE", "DOWN", "FALL", "OUT", "SILK"],
    ["WORM", "HOLE", "SOME", "THING", "TIME", "LINE", "BACK", "FIRE", "FLY", "PAPER", "WORK", "SHOP", "LIFT", "OFF", "SHORE", "EARTH"],
    ["WORM", "WOOD", "WORK", "BENCH", "MARK", "UP", "BEAT", "DOWN", "POUR", "RAIN", "COAT", "RACK", "BALL", "ROOM", "MATE", "TAPE"],
    ["OUT", "BREAK", "DOWN", "TOWN", "HOUSE", "WIFE", "LIFE", "BOAT", "LOAD", "STAR", "LIGHT", "YEAR", "BOOK", "WORM", "HOLE", "BLACK"],
    ["OUT", "DOOR", "BELL", "BOY", "FRIEND", "SHIP", "YARD", "BIRD", "BRAIN", "WAVE", "POOL", "SIDE", "WALK", "ABOUT", "FACE", "CHECK"],
    ["OUT", "SIDE", "LINE", "BACK", "BONE", "DRY", "CLEAN", "SWEEP", "STAKE", "HOLD", "UP", "LIFT", "OFF", "HAND", "SHAKE", "KNOCK"],
    ["OUT", "BREAK", "FAST", "BALL", "ROOM", "MATE", "SHIP", "SHAPE", "UP", "BEAT", "BOX", "CAR", "POOL", "HALL", "MARK", "LOOK"],
    ["OUT", "SIDE", "STEP", "SON", "LIGHT", "HOUSE", "HOLD", "BACK", "PACK", "RAT", "RACE", "TRACK", "BALL", "GAME", "PLAN", "HIDE"],
    ["OUT", "DOOR", "STEP", "CHILD", "HOOD", "WINK", "EYE", "BALL", "ROOM", "SERVICE", "MARK", "DOWN", "FALL", "BACK", "YARD", "COOK"],
    ["OUT", "BREAK", "DOWN", "LOAD", "STONE", "COLD", "BLOOD", "HOUND", "DOG", "HOUSE", "BOAT", "YARD", "STICK", "UP", "LIFT", "HANG"],
    ["OUT", "SIDE", "WALK", "OUT", "DOOR", "BELL", "HOP", "SCOTCH", "TAPE", "WORM", "WOOD", "LAND", "LORD", "SHIP", "YARD", "STAND"],
    ["OUT", "BREAK", "FAST", "FOOD", "CHAIN", "LINK", "UP", "TOWN", "HOUSE", "WIFE", "LIFE", "LINE", "BACK", "FIRE", "FLY", "BURN"],
    ["OUT", "DOOR", "BELL", "BOY", "SCOUT", "MASTER", "MIND", "SET", "BACK", "YARD", "BIRD", "HOUSE", "WORK", "SHOP", "LIFT", "TIME"],
    ["OUT", "SIDE", "LINE", "UP", "BEAT", "DOWN", "TOWN", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "SHAKE", "DOWN", "FALL"],
    ["OUT", "BREAK", "DOWN", "HILL", "TOP", "COAT", "RACK", "BALL", "POINT", "BLANK", "CHECK", "BOOK", "MARK", "UP", "LIFT", "TAKE"],
    ["HOUSE", "HOLD", "UP", "BEAT", "DOWN", "FALL", "OUT", "BREAK", "FAST", "BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "LIGHT"],
    ["HOUSE", "BOAT", "LOAD", "STAR", "FISH", "BOWL", "CUT", "BACK", "YARD", "BIRD", "BRAIN", "WAVE", "POOL", "SIDE", "LINE", "TREE"],
    ["HOUSE", "WIFE", "LIFE", "LINE", "BACK", "BONE", "HEAD", "LIGHT", "YEAR", "BOOK", "WORM", "HOLE", "PUNCH", "BOWL", "CUT", "FIRE"],
    ["HOUSE", "WORK", "SHOP", "LIFT", "OFF", "HAND", "SHAKE", "DOWN", "POUR", "RAIN", "DROP", "KICK", "STAND", "POINT", "BLANK", "FARM"],
    ["HOUSE", "HOLD", "BACK", "PACK", "RAT", "RACE", "CAR", "POOL", "HALL", "WAY", "SIDE", "KICK", "STAND", "UP", "BEAT", "GREEN"],
    ["HOUSE", "BOAT", "YARD", "STICK", "UP", "LIFT", "OFF", "SHORE", "LINE", "DRIVE", "WAY", "FARE", "WELL", "SPRING", "BOARD", "WARE"],
    ["HOUSE", "WIFE", "LIFE", "BOAT", "LOAD", "STONE", "WALL", "PAPER", "BACK", "FIRE", "SIDE", "WALK", "OUT", "DOOR", "SHOW", "ROAD"],
    ["HOUSE", "HOLD", "UP", "TOWN", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "OUT", "SIDE", "LINE", "BACK", "BONE", "CLUB"],
    ["HOUSE", "WORK", "LOAD", "STAR", "LIGHT", "BULB", "HEAD", "LINE", "UP", "BEAT", "DOWN", "FALL", "OUT", "BREAK", "FAST", "DOG"],
    ["HOUSE", "WIFE", "LIFE", "LINE", "DRIVE", "WAY", "SIDE", "KICK", "STAND", "POINT", "BLANK", "CHECK", "BOOK", "WORM", "HOLE", "BOAT"],
    ["HOUSE", "BOAT", "YARD", "BIRD", "BRAIN", "STORM", "CLOUD", "BURST", "OUT", "SIDE", "STEP", "SON", "LIGHT", "YEAR", "BOOK", "MAD"],
    ["HOUSE", "HOLD", "BACK", "YARD", "STICK", "UP", "BEAT", "BOX", "CAR", "WASH", "OUT", "DOOR", "BELL", "HOP", "SCOTCH", "BATH"],
    ["HOUSE", "WIFE", "LIFE", "BOAT", "RACE", "CAR", "POOL", "SIDE", "LINE", "BACK", "FIRE", "FLY", "PAPER", "WORK", "SHOP", "JAIL"],
    ["HOUSE", "WORK", "BENCH", "MARK", "DOWN", "TOWN", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "SHAKE", "DOWN", "FALL", "PENT"],
    ["HOUSE", "BOAT", "LOAD", "STAR", "FISH", "POND", "LIFE", "LINE", "UP", "BEAT", "DOWN", "POUR", "RAIN", "DROP", "KICK", "PLAY"],
    ["HOUSE", "HOLD", "UP", "LIFT", "OFF", "HAND", "OUT", "BREAK", "FAST", "BALL", "GAME", "PLAN", "LAND", "LORD", "SHIP", "BLOCK"],
    ["HOUSE", "WIFE", "LIFE", "GUARD", "RAIL", "ROAD", "SIDE", "WALK", "OUT", "DOOR", "STEP", "SON", "LIGHT", "HOUSE", "BOAT", "ICE"],
    ["HOUSE", "WORK", "SHOP", "LIFT", "OFF", "SHORE", "LINE", "BACK", "BONE", "DRY", "CLEAN", "UP", "BEAT", "DOWN", "FALL", "POWER"],
    ["HOUSE", "BOAT", "YARD", "BIRD", "HOUSE", "WIFE", "LIFE", "LINE", "DRIVE", "WAY", "SIDE", "KICK", "STAND", "UP", "LIFT", "STORE"],
    ["HOUSE", "HOLD", "BACK", "FIRE", "SIDE", "LINE", "UP", "TOWN", "SHIP", "YARD", "STICK", "UP", "BEAT", "BOX", "CAR", "SCHOOL"],
    ["HOUSE", "WIFE", "LIFE", "BOAT", "LOAD", "STONE", "WALL", "FLOWER", "BED", "ROOM", "MATE", "SHIP", "YARD", "SALE", "TAX", "ROUND"],
    ["HOUSE", "WORK", "LOAD", "STAR", "LIGHT", "YEAR", "BOOK", "MARK", "DOWN", "HILL", "TOP", "COAT", "RACK", "BALL", "GAME", "COFFEE"],
    ["HOUSE", "BOAT", "YARD", "STICK", "UP", "BEAT", "DOWN", "POUR", "RAIN", "COAT", "TAIL", "SPIN", "OFF", "HAND", "SHAKE", "DOLL"],
    ["HOUSE", "HOLD", "UP", "LIFT", "OFF", "SHORE", "LINE", "BACK", "PACK", "RAT", "RACE", "TRACK", "BALL", "ROOM", "SERVICE", "GATE"],
    ["HOUSE", "WIFE", "LIFE", "LINE", "UP", "BEAT", "BOX", "CAR", "POOL", "HALL", "MARK", "DOWN", "FALL", "OUT", "BREAK", "HEN"],
    ["BAG", "PIPE", "LINE", "BACK", "YARD", "BIRD", "HOUSE", "BOAT", "LOAD", "STAR", "FISH", "BOWL", "CUT", "THROAT", "COAT", "SADDLE"],
    ["BAG", "PIPE", "DREAM", "LAND", "LORD", "SHIP", "YARD", "STICK", "UP", "BEAT", "DOWN", "TOWN", "HOUSE", "WORK", "SHOP", "SAND"],
    ["BAG", "LADY", "BUG", "BEAR", "FOOT", "BALL", "ROOM", "MATE", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "OUT", "MAIL"],
    ["BAG", "PIPE", "LINE", "UP", "LIFT", "OFF", "HAND", "SHAKE", "DOWN", "FALL", "OUT", "SIDE", "KICK", "STAND", "POINT", "PUNCH"],
    ["BAG", "PIPE", "DREAM", "BOAT", "YARD", "BIRD", "BRAIN", "STORM", "CLOUD", "BURST", "OUT", "BREAK", "FAST", "FOOD", "STRING", "BEAN"],
    ["STEP", "SON", "LIGHT", "HOUSE", "WIFE", "LIFE", "LINE", "BACK", "FIRE", "FLY", "PAPER", "WORK", "BENCH", "MARK", "DOWN", "DOOR"],
    ["STEP", "CHILD", "HOOD", "WINK", "EYE", "BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "DOWN", "FALL", "FOOT"],
    ["STEP", "SON", "LIGHT", "YEAR", "BOOK", "WORM", "HOLE", "PUNCH", "LINE", "UP", "LIFT", "OFF", "HAND", "OUT", "BREAK", "SIDE"],
    ["STEP", "CHILD", "BIRTH", "DAY", "LIGHT", "HOUSE", "HOLD", "UP", "BEAT", "BOX", "CAR", "POOL", "SIDE", "WALK", "OUT", "DOOR"],
    ["STEP", "SON", "LIGHT", "BULB", "HEAD", "LINE", "DRIVE", "WAY", "SIDE", "KICK", "STAND", "POINT", "BLANK", "CHECK", "SAND", "QUICK"],
    ["STEP", "CHILD", "HOOD", "WINK", "EYE", "BROW", "BEAT", "DOWN", "FALL", "OUT", "SIDE", "LINE", "UP", "LIFT", "OFF", "LOCK"],
    ["STEP", "SON", "LIGHT", "HOUSE", "BOAT", "YARD", "BIRD", "BRAIN", "WAVE", "POOL", "HALL", "MARK", "DOWN", "TOWN", "SHIP", "BACK"],
    ["STEP", "CHILD", "BIRTH", "DAY", "DREAM", "LAND", "LORD", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "SHAKE", "DOWN", "MISS"],
    ["STEP", "SON", "LIGHT", "YEAR", "BOOK", "MARK", "UP", "BEAT", "BOX", "CAR", "WASH", "OUT", "DOOR", "BELL", "HOP", "OVER"],
    ["STEP", "CHILD", "HOOD", "WINK", "EYE", "BALL", "POINT", "BLANK", "CHECK", "BOOK", "WORM", "WOOD", "LAND", "LORD", "SHIP", "IN"],
    ["BEAT", "DOWN", "FALL", "OUT", "BREAK", "FAST", "BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "LIFT", "OFF", "UP"],
    ["BEAT", "BOX", "CAR", "POOL", "SIDE", "WALK", "OUT", "DOOR", "STEP", "SON", "LIGHT", "HOUSE", "HOLD", "UP", "TOWN", "DOWN"],
    ["BEAT", "DOWN", "POUR", "RAIN", "COAT", "RACK", "BALL", "GAME", "PLAN", "LAND", "LORD", "SHIP", "YARD", "STICK", "UP", "OFF"],
    ["BEAT", "DOWN", "HILL", "TOP", "COAT", "TAIL", "SPIN", "OFF", "HAND", "SHAKE", "DOWN", "FALL", "OUT", "BREAK", "FAST", "HEART"],
    ["BEAT", "BOX", "SPRING", "BOARD", "WALK", "OUT", "SIDE", "LINE", "BACK", "FIRE", "FLY", "PAPER", "WORK", "SHOP", "LIFT", "DRUM"],
    ["BEAT", "DOWN", "TOWN", "HOUSE", "WIFE", "LIFE", "BOAT", "LOAD", "STAR", "FISH", "BOWL", "CUT", "BACK", "YARD", "BIRD", "DEAD"],
    ["BEAT", "BOX", "CAR", "WASH", "OUT", "DOOR", "BELL", "BOY", "FRIEND", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "BACK"],
    ["DOWN", "FALL", "OUT", "BREAK", "FAST", "BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "BOX", "CAR", "SUN"],
    ["DOWN", "POUR", "RAIN", "COAT", "RACK", "BALL", "GAME", "PLAN", "LAND", "LORD", "SHIP", "YARD", "BIRD", "HOUSE", "HOLD", "COUNT"],
    ["DOWN", "TOWN", "HOUSE", "WIFE", "LIFE", "LINE", "BACK", "FIRE", "SIDE", "WALK", "OUT", "DOOR", "STEP", "SON", "LIGHT", "BREAK"]
];

const LAUNCH_DATE = new Date('2025-11-29T00:00:00');

function getPuzzleIndex() {
    const now = new Date();
    const pacificTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const pacificMidnight = new Date(pacificTime);
    pacificMidnight.setHours(0, 0, 0, 0);

    const launchPacific = new Date(LAUNCH_DATE.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    launchPacific.setHours(0, 0, 0, 0);

    const diffTime = pacificMidnight.getTime() - launchPacific.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return Math.abs(diffDays) % puzzles.length;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getValidPairs(solution) {
    const pairs = [];
    for (let i = 0; i < solution.length; i++) {
        const wordA = solution[i];
        const wordB = solution[(i + 1) % solution.length];
        pairs.push(`${wordA}+${wordB}`);
    }
    // Shuffle the pairs so order doesn't reveal solution
    return shuffleArray(pairs);
}

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const puzzleIndex = getPuzzleIndex();
    const solution = puzzles[puzzleIndex];

    // Return shuffled words and valid pairs - NEVER the solution order
    const response = {
        puzzleNumber: puzzleIndex + 1,
        words: shuffleArray(solution),
        validPairs: getValidPairs(solution),
        date: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'America/Los_Angeles'
        })
    };

    res.status(200).json(response);
}
