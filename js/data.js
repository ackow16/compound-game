// Validated compound word chains
// Each chain: 16 words where adjacent pairs form compound words
// Critical: word16 + word1 must also form a compound (loops back)

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
    // Puzzle 11: RAINFALL loops back
    ["FALL", "BACK", "PACK", "RAT", "RACE", "TRACK", "BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "DOWN", "RAIN"],
    // Puzzle 12: EARTHQUAKE loops back
    ["QUAKE", "PROOF", "READ", "OUT", "DOOR", "BELL", "HOP", "SCOTCH", "TAPE", "WORM", "WOOD", "WORK", "SHOP", "LIFT", "OFF", "EARTH"],
    // Puzzle 13: BLACKBIRD loops back
    ["BIRD", "HOUSE", "HOLD", "BACK", "BONE", "HEAD", "LIGHT", "WEIGHT", "LIFT", "OFF", "HAND", "SHAKE", "DOWN", "TOWN", "SHIP", "BLACK"],
    // Puzzle 14: BLUEBIRD loops back
    ["BIRD", "BATH", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "LIFT", "OFF", "BEAT", "BOX", "CAR", "POOL", "HALL", "BLUE"],
    // Puzzle 15: WILDFIRE loops back
    ["FIRE", "FLY", "PAPER", "BACK", "YARD", "BIRD", "BRAIN", "WAVE", "POOL", "SIDE", "WALK", "OUT", "BREAK", "DOWN", "FALL", "WILD"],
    // Puzzle 16: CAMPFIRE loops back
    ["FIRE", "SIDE", "LINE", "BACK", "BONE", "DRY", "CLEAN", "UP", "BEAT", "DOWN", "POUR", "RAIN", "DROP", "KICK", "STAND", "CAMP"],
    // Puzzle 17: FOOTPRINT loops back
    ["PRINT", "OUT", "BREAK", "FAST", "BALL", "GAME", "PLAN", "LAND", "LORD", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "FOOT"],
    // Puzzle 18: HEARTBEAT loops back
    ["BEAT", "DOWN", "FALL", "OUT", "SIDE", "STEP", "SON", "LIGHT", "HOUSE", "WIFE", "LIFE", "LINE", "BACK", "FIRE", "FLY", "HEART"],
    // Puzzle 19: NIGHTFALL loops back
    ["FALL", "BACK", "HAND", "SHAKE", "DOWN", "TOWN", "HOUSE", "BOAT", "LOAD", "STAR", "FISH", "BOWL", "CUT", "THROAT", "COAT", "NIGHT"],
    // Puzzle 20: DAYLIGHT loops back
    ["LIGHT", "YEAR", "BOOK", "MARK", "DOWN", "HILL", "SIDE", "KICK", "STAND", "POINT", "BLANK", "CHECK", "MATE", "SHIP", "YARD", "DAY"],
    // Puzzle 21: SNOWFLAKE loops back
    ["FLAKE", "OUT", "BREAK", "DOWN", "LOAD", "STONE", "WALL", "PAPER", "BACK", "BONE", "HEAD", "LIGHT", "HOUSE", "WORK", "SHOP", "SNOW"],
    // Puzzle 22: SUNBURN loops back
    ["BURN", "OUT", "DOOR", "BELL", "BOY", "FRIEND", "SHIP", "YARD", "STICK", "UP", "BEAT", "DOWN", "FALL", "BACK", "FIRE", "SUN"],
    // Puzzle 23: WINDMILL loops back
    ["MILL", "STONE", "WALL", "FLOWER", "BED", "ROOM", "MATE", "SHIP", "SHAPE", "UP", "TOWN", "HOUSE", "HOLD", "BACK", "PACK", "WIND"],
    // Puzzle 24: HORSEBACK loops back
    ["BACK", "YARD", "BIRD", "HOUSE", "WORK", "LOAD", "STAR", "LIGHT", "BULB", "HEAD", "LINE", "DRIVE", "WAY", "SIDE", "SADDLE", "HORSE"],
    // Puzzle 25: KEYBOARD loops back
    ["BOARD", "WALK", "OUT", "SIDE", "LINE", "BACK", "PACK", "RAT", "RACE", "CAR", "POOL", "HALL", "MARK", "DOWN", "TOWN", "KEY"],
    // Puzzle 26: CUPBOARD loops back
    ["BOARD", "GAME", "PLAN", "LAND", "LORD", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "SHAKE", "DOWN", "FALL", "OUT", "CUP"],
    // Puzzle 27: BASEBALL loops back
    ["BALL", "POINT", "BLANK", "CHECK", "BOOK", "WORM", "HOLE", "PUNCH", "LINE", "UP", "BEAT", "BOX", "CAR", "WASH", "OUT", "BASE"],
    // Puzzle 28: FOOTBALL loops back
    ["BALL", "ROOM", "SERVICE", "MARK", "DOWN", "POUR", "RAIN", "COAT", "RACK", "BALL", "GAME", "SHOW", "DOWN", "HILL", "TOP", "FOOT"],
    // Puzzle 29: BASKETBALL loops back
    ["BALL", "GAME", "PLAN", "LAND", "SLIDE", "SHOW", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "LIFT", "OFF", "HAND", "BASKET"],
    // Puzzle 30: HOMEWORK loops back
    ["WORK", "SHOP", "LIFT", "OFF", "SHORE", "LINE", "BACK", "FIRE", "SIDE", "WALK", "OUT", "DOOR", "BELL", "HOP", "SCOTCH", "HOME"],
    // Puzzle 31: CLOCKWORK loops back
    ["WORK", "BENCH", "MARK", "DOWN", "TOWN", "HOUSE", "BOAT", "YARD", "BIRD", "BRAIN", "STORM", "CLOUD", "BURST", "OUT", "BREAK", "CLOCK"],
    // Puzzle 32: NETWORK loops back
    ["WORK", "LOAD", "STAR", "LIGHT", "HOUSE", "HOLD", "UP", "BEAT", "DOWN", "FALL", "OUT", "SIDE", "LINE", "DRIVE", "WAY", "NET"],
    // Puzzle 33: TEAMWORK loops back
    ["WORK", "FORCE", "FIELD", "GOAL", "POST", "CARD", "BOARD", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "BOX", "TEAM"],
    // Puzzle 34: FRAMEWORK loops back
    ["WORK", "OUT", "BREAK", "FAST", "FOOD", "CHAIN", "LINK", "UP", "TOWN", "SHIP", "YARD", "BIRD", "HOUSE", "WIFE", "LIFE", "FRAME"],
    // Puzzle 35: BOOKWORM loops back
    ["WORM", "HOLE", "PUNCH", "BOWL", "CUT", "BACK", "YARD", "SALE", "TAX", "FREE", "HAND", "OUT", "DOOR", "STEP", "SON", "BOOK"],
    // Puzzle 36: SILKWORM loops back
    ["WORM", "WOOD", "LAND", "LORD", "SHIP", "YARD", "STICK", "UP", "LIFT", "OFF", "HAND", "SHAKE", "DOWN", "FALL", "OUT", "SILK"],
    // Puzzle 37: EARTHWORM loops back
    ["WORM", "HOLE", "SOME", "THING", "TIME", "LINE", "BACK", "FIRE", "FLY", "PAPER", "WORK", "SHOP", "LIFT", "OFF", "SHORE", "EARTH"],
    // Puzzle 38: TAPEWORM loops back
    ["WORM", "WOOD", "WORK", "BENCH", "MARK", "UP", "BEAT", "DOWN", "POUR", "RAIN", "COAT", "RACK", "BALL", "ROOM", "MATE", "TAPE"],
    // Puzzle 39: BLACKOUT loops back
    ["OUT", "BREAK", "DOWN", "TOWN", "HOUSE", "WIFE", "LIFE", "BOAT", "LOAD", "STAR", "LIGHT", "YEAR", "BOOK", "WORM", "HOLE", "BLACK"],
    // Puzzle 40: CHECKOUT loops back
    ["OUT", "DOOR", "BELL", "BOY", "FRIEND", "SHIP", "YARD", "BIRD", "BRAIN", "WAVE", "POOL", "SIDE", "WALK", "ABOUT", "FACE", "CHECK"],
    // Puzzle 41: KNOCKOUT loops back
    ["OUT", "SIDE", "LINE", "BACK", "BONE", "DRY", "CLEAN", "SWEEP", "STAKE", "HOLD", "UP", "LIFT", "OFF", "HAND", "SHAKE", "KNOCK"],
    // Puzzle 42: LOOKOUT loops back
    ["OUT", "BREAK", "FAST", "BALL", "ROOM", "MATE", "SHIP", "SHAPE", "UP", "BEAT", "BOX", "CAR", "POOL", "HALL", "MARK", "LOOK"],
    // Puzzle 43: HIDEOUT loops back
    ["OUT", "SIDE", "STEP", "SON", "LIGHT", "HOUSE", "HOLD", "BACK", "PACK", "RAT", "RACE", "TRACK", "BALL", "GAME", "PLAN", "HIDE"],
    // Puzzle 44: COOKOUT loops back
    ["OUT", "DOOR", "STEP", "CHILD", "HOOD", "WINK", "EYE", "BALL", "ROOM", "SERVICE", "MARK", "DOWN", "FALL", "BACK", "YARD", "COOK"],
    // Puzzle 45: HANGOUT loops back
    ["OUT", "BREAK", "DOWN", "LOAD", "STONE", "COLD", "BLOOD", "HOUND", "DOG", "HOUSE", "BOAT", "YARD", "STICK", "UP", "LIFT", "HANG"],
    // Puzzle 46: STANDOUT loops back
    ["OUT", "SIDE", "WALK", "OUT", "DOOR", "BELL", "HOP", "SCOTCH", "TAPE", "WORM", "WOOD", "LAND", "LORD", "SHIP", "YARD", "STAND"],
    // Puzzle 47: BURNOUT loops back
    ["OUT", "BREAK", "FAST", "FOOD", "CHAIN", "LINK", "UP", "TOWN", "HOUSE", "WIFE", "LIFE", "LINE", "BACK", "FIRE", "FLY", "BURN"],
    // Puzzle 48: TIMEOUT loops back
    ["OUT", "DOOR", "BELL", "BOY", "SCOUT", "MASTER", "MIND", "SET", "BACK", "YARD", "BIRD", "HOUSE", "WORK", "SHOP", "LIFT", "TIME"],
    // Puzzle 49: FALLOUT loops back
    ["OUT", "SIDE", "LINE", "UP", "BEAT", "DOWN", "TOWN", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "SHAKE", "DOWN", "FALL"],
    // Puzzle 50: TAKEOUT loops back
    ["OUT", "BREAK", "DOWN", "HILL", "TOP", "COAT", "RACK", "BALL", "POINT", "BLANK", "CHECK", "BOOK", "MARK", "UP", "LIFT", "TAKE"],
    // Puzzle 51: LIGHTHOUSE loops back
    ["HOUSE", "HOLD", "UP", "BEAT", "DOWN", "FALL", "OUT", "BREAK", "FAST", "BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "LIGHT"],
    // Puzzle 52: TREEHOUSE loops back
    ["HOUSE", "BOAT", "LOAD", "STAR", "FISH", "BOWL", "CUT", "BACK", "YARD", "BIRD", "BRAIN", "WAVE", "POOL", "SIDE", "LINE", "TREE"],
    // Puzzle 53: FIREHOUSE loops back
    ["HOUSE", "WIFE", "LIFE", "LINE", "BACK", "BONE", "HEAD", "LIGHT", "YEAR", "BOOK", "WORM", "HOLE", "PUNCH", "BOWL", "CUT", "FIRE"],
    // Puzzle 54: FARMHOUSE loops back
    ["HOUSE", "WORK", "SHOP", "LIFT", "OFF", "HAND", "SHAKE", "DOWN", "POUR", "RAIN", "DROP", "KICK", "STAND", "POINT", "BLANK", "FARM"],
    // Puzzle 55: GREENHOUSE loops back
    ["HOUSE", "HOLD", "BACK", "PACK", "RAT", "RACE", "CAR", "POOL", "HALL", "WAY", "SIDE", "KICK", "STAND", "UP", "BEAT", "GREEN"],
    // Puzzle 56: WAREHOUSE loops back
    ["HOUSE", "BOAT", "YARD", "STICK", "UP", "LIFT", "OFF", "SHORE", "LINE", "DRIVE", "WAY", "FARE", "WELL", "SPRING", "BOARD", "WARE"],
    // Puzzle 57: ROADHOUSE loops back
    ["HOUSE", "WIFE", "LIFE", "BOAT", "LOAD", "STONE", "WALL", "PAPER", "BACK", "FIRE", "SIDE", "WALK", "OUT", "DOOR", "SHOW", "ROAD"],
    // Puzzle 58: CLUBHOUSE loops back
    ["HOUSE", "HOLD", "UP", "TOWN", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "OUT", "SIDE", "LINE", "BACK", "BONE", "CLUB"],
    // Puzzle 59: DOGHOUSE loops back
    ["HOUSE", "WORK", "LOAD", "STAR", "LIGHT", "BULB", "HEAD", "LINE", "UP", "BEAT", "DOWN", "FALL", "OUT", "BREAK", "FAST", "DOG"],
    // Puzzle 60: BOATHOUSE loops back
    ["HOUSE", "WIFE", "LIFE", "LINE", "DRIVE", "WAY", "SIDE", "KICK", "STAND", "POINT", "BLANK", "CHECK", "BOOK", "WORM", "HOLE", "BOAT"],
    // Puzzle 61: MADHOUSE loops back
    ["HOUSE", "BOAT", "YARD", "BIRD", "BRAIN", "STORM", "CLOUD", "BURST", "OUT", "SIDE", "STEP", "SON", "LIGHT", "YEAR", "BOOK", "MAD"],
    // Puzzle 62: BATHHOUSE loops back
    ["HOUSE", "HOLD", "BACK", "YARD", "STICK", "UP", "BEAT", "BOX", "CAR", "WASH", "OUT", "DOOR", "BELL", "HOP", "SCOTCH", "BATH"],
    // Puzzle 63: JAILHOUSE loops back
    ["HOUSE", "WIFE", "LIFE", "BOAT", "RACE", "CAR", "POOL", "SIDE", "LINE", "BACK", "FIRE", "FLY", "PAPER", "WORK", "SHOP", "JAIL"],
    // Puzzle 64: PENTHOUSE loops back
    ["HOUSE", "WORK", "BENCH", "MARK", "DOWN", "TOWN", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "SHAKE", "DOWN", "FALL", "PENT"],
    // Puzzle 65: PLAYHOUSE loops back
    ["HOUSE", "BOAT", "LOAD", "STAR", "FISH", "POND", "LIFE", "LINE", "UP", "BEAT", "DOWN", "POUR", "RAIN", "DROP", "KICK", "PLAY"],
    // Puzzle 66: BLOCKHOUSE loops back
    ["HOUSE", "HOLD", "UP", "LIFT", "OFF", "HAND", "OUT", "BREAK", "FAST", "BALL", "GAME", "PLAN", "LAND", "LORD", "SHIP", "BLOCK"],
    // Puzzle 67: ICEHOUSE loops back
    ["HOUSE", "WIFE", "LIFE", "GUARD", "RAIL", "ROAD", "SIDE", "WALK", "OUT", "DOOR", "STEP", "SON", "LIGHT", "HOUSE", "BOAT", "ICE"],
    // Puzzle 68: POWERHOUSE loops back
    ["HOUSE", "WORK", "SHOP", "LIFT", "OFF", "SHORE", "LINE", "BACK", "BONE", "DRY", "CLEAN", "UP", "BEAT", "DOWN", "FALL", "POWER"],
    // Puzzle 69: STOREHOUSE loops back
    ["HOUSE", "BOAT", "YARD", "BIRD", "HOUSE", "WIFE", "LIFE", "LINE", "DRIVE", "WAY", "SIDE", "KICK", "STAND", "UP", "LIFT", "STORE"],
    // Puzzle 70: SCHOOLHOUSE loops back
    ["HOUSE", "HOLD", "BACK", "FIRE", "SIDE", "LINE", "UP", "TOWN", "SHIP", "YARD", "STICK", "UP", "BEAT", "BOX", "CAR", "SCHOOL"],
    // Puzzle 71: ROUNDHOUSE loops back
    ["HOUSE", "WIFE", "LIFE", "BOAT", "LOAD", "STONE", "WALL", "FLOWER", "BED", "ROOM", "MATE", "SHIP", "YARD", "SALE", "TAX", "ROUND"],
    // Puzzle 72: COFFEHOUSE loops back
    ["HOUSE", "WORK", "LOAD", "STAR", "LIGHT", "YEAR", "BOOK", "MARK", "DOWN", "HILL", "TOP", "COAT", "RACK", "BALL", "GAME", "COFFEE"],
    // Puzzle 73: DOLLHOUSE loops back
    ["HOUSE", "BOAT", "YARD", "STICK", "UP", "BEAT", "DOWN", "POUR", "RAIN", "COAT", "TAIL", "SPIN", "OFF", "HAND", "SHAKE", "DOLL"],
    // Puzzle 74: GATEHOUSE loops back
    ["HOUSE", "HOLD", "UP", "LIFT", "OFF", "SHORE", "LINE", "BACK", "PACK", "RAT", "RACE", "TRACK", "BALL", "ROOM", "SERVICE", "GATE"],
    // Puzzle 75: HENHOUSE loops back
    ["HOUSE", "WIFE", "LIFE", "LINE", "UP", "BEAT", "BOX", "CAR", "POOL", "HALL", "MARK", "DOWN", "FALL", "OUT", "BREAK", "HEN"],
    // Puzzle 76: SADDLEBAG loops back
    ["BAG", "PIPE", "LINE", "BACK", "YARD", "BIRD", "HOUSE", "BOAT", "LOAD", "STAR", "FISH", "BOWL", "CUT", "THROAT", "COAT", "SADDLE"],
    // Puzzle 77: SANDBAG loops back
    ["BAG", "PIPE", "DREAM", "LAND", "LORD", "SHIP", "YARD", "STICK", "UP", "BEAT", "DOWN", "TOWN", "HOUSE", "WORK", "SHOP", "SAND"],
    // Puzzle 78: MAILBAG loops back
    ["BAG", "LADY", "BUG", "BEAR", "FOOT", "BALL", "ROOM", "MATE", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "OUT", "MAIL"],
    // Puzzle 79: PUNCHING BAG loops back (PUNCHBAG)
    ["BAG", "PIPE", "LINE", "UP", "LIFT", "OFF", "HAND", "SHAKE", "DOWN", "FALL", "OUT", "SIDE", "KICK", "STAND", "POINT", "PUNCH"],
    // Puzzle 80: BEANBAG loops back
    ["BAG", "PIPE", "DREAM", "BOAT", "YARD", "BIRD", "BRAIN", "STORM", "CLOUD", "BURST", "OUT", "BREAK", "FAST", "FOOD", "STRING", "BEAN"],
    // Puzzle 81: DOORSTEP loops back
    ["STEP", "SON", "LIGHT", "HOUSE", "WIFE", "LIFE", "LINE", "BACK", "FIRE", "FLY", "PAPER", "WORK", "BENCH", "MARK", "DOWN", "DOOR"],
    // Puzzle 82: FOOTSTEP loops back
    ["STEP", "CHILD", "HOOD", "WINK", "EYE", "BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "DOWN", "FALL", "FOOT"],
    // Puzzle 83: SIDESTEP loops back
    ["STEP", "SON", "LIGHT", "YEAR", "BOOK", "WORM", "HOLE", "PUNCH", "LINE", "UP", "LIFT", "OFF", "HAND", "OUT", "BREAK", "SIDE"],
    // Puzzle 84: DOORSTEP loops back
    ["STEP", "CHILD", "BIRTH", "DAY", "LIGHT", "HOUSE", "HOLD", "UP", "BEAT", "BOX", "CAR", "POOL", "SIDE", "WALK", "OUT", "DOOR"],
    // Puzzle 85: QUICKSTEP loops back
    ["STEP", "SON", "LIGHT", "BULB", "HEAD", "LINE", "DRIVE", "WAY", "SIDE", "KICK", "STAND", "POINT", "BLANK", "CHECK", "SAND", "QUICK"],
    // Puzzle 86: LOCKSTEP loops back
    ["STEP", "CHILD", "HOOD", "WINK", "EYE", "BROW", "BEAT", "DOWN", "FALL", "OUT", "SIDE", "LINE", "UP", "LIFT", "OFF", "LOCK"],
    // Puzzle 87: BACKSTEP loops back
    ["STEP", "SON", "LIGHT", "HOUSE", "BOAT", "YARD", "BIRD", "BRAIN", "WAVE", "POOL", "HALL", "MARK", "DOWN", "TOWN", "SHIP", "BACK"],
    // Puzzle 88: MISSTEP loops back
    ["STEP", "CHILD", "BIRTH", "DAY", "DREAM", "LAND", "LORD", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "SHAKE", "DOWN", "MISS"],
    // Puzzle 89: OVERSTEP loops back
    ["STEP", "SON", "LIGHT", "YEAR", "BOOK", "MARK", "UP", "BEAT", "BOX", "CAR", "WASH", "OUT", "DOOR", "BELL", "HOP", "OVER"],
    // Puzzle 90: INSTEP loops back
    ["STEP", "CHILD", "HOOD", "WINK", "EYE", "BALL", "POINT", "BLANK", "CHECK", "BOOK", "WORM", "WOOD", "LAND", "LORD", "SHIP", "IN"],
    // Puzzle 91: UPBEAT loops back
    ["BEAT", "DOWN", "FALL", "OUT", "BREAK", "FAST", "BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "LIFT", "OFF", "UP"],
    // Puzzle 92: DOWNBEAT loops back
    ["BEAT", "BOX", "CAR", "POOL", "SIDE", "WALK", "OUT", "DOOR", "STEP", "SON", "LIGHT", "HOUSE", "HOLD", "UP", "TOWN", "DOWN"],
    // Puzzle 93: OFFBEAT loops back
    ["BEAT", "DOWN", "POUR", "RAIN", "COAT", "RACK", "BALL", "GAME", "PLAN", "LAND", "LORD", "SHIP", "YARD", "STICK", "UP", "OFF"],
    // Puzzle 94: HEARTBEAT loops back
    ["BEAT", "DOWN", "HILL", "TOP", "COAT", "TAIL", "SPIN", "OFF", "HAND", "SHAKE", "DOWN", "FALL", "OUT", "BREAK", "FAST", "HEART"],
    // Puzzle 95: DRUMBEAT loops back
    ["BEAT", "BOX", "SPRING", "BOARD", "WALK", "OUT", "SIDE", "LINE", "BACK", "FIRE", "FLY", "PAPER", "WORK", "SHOP", "LIFT", "DRUM"],
    // Puzzle 96: DEADBEAT loops back
    ["BEAT", "DOWN", "TOWN", "HOUSE", "WIFE", "LIFE", "BOAT", "LOAD", "STAR", "FISH", "BOWL", "CUT", "BACK", "YARD", "BIRD", "DEAD"],
    // Puzzle 97: BACKBEAT loops back
    ["BEAT", "BOX", "CAR", "WASH", "OUT", "DOOR", "BELL", "BOY", "FRIEND", "SHIP", "YARD", "SALE", "TAX", "FREE", "HAND", "BACK"],
    // Puzzle 98: SUNDOWN loops back
    ["DOWN", "FALL", "OUT", "BREAK", "FAST", "BALL", "ROOM", "MATE", "SHIP", "YARD", "STICK", "UP", "BEAT", "BOX", "CAR", "SUN"],
    // Puzzle 99: COUNTDOWN loops back
    ["DOWN", "POUR", "RAIN", "COAT", "RACK", "BALL", "GAME", "PLAN", "LAND", "LORD", "SHIP", "YARD", "BIRD", "HOUSE", "HOLD", "COUNT"],
    // Puzzle 100: BREAKDOWN loops back
    ["DOWN", "TOWN", "HOUSE", "WIFE", "LIFE", "LINE", "BACK", "FIRE", "SIDE", "WALK", "OUT", "DOOR", "STEP", "SON", "LIGHT", "BREAK"]
];

// Launch date - puzzles rotate starting from this date at 12am Pacific
// Set to today so Puzzle 1 starts now, Puzzle 2 tomorrow, etc.
const LAUNCH_DATE = new Date('2025-11-29T00:00:00');

export const dailyPuzzle = {
    get puzzleIndex() {
        // Get current time in Pacific timezone
        const now = new Date();
        const pacificTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

        // Set to midnight Pacific for consistent daily rotation
        const pacificMidnight = new Date(pacificTime);
        pacificMidnight.setHours(0, 0, 0, 0);

        // Calculate days since launch
        const launchPacific = new Date(LAUNCH_DATE.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
        launchPacific.setHours(0, 0, 0, 0);

        const diffTime = pacificMidnight.getTime() - launchPacific.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Cycle through puzzles (wrap around after 100)
        return Math.abs(diffDays) % puzzles.length;
    },

    get solution() {
        return puzzles[this.puzzleIndex];
    },

    getValidPairs() {
        const pairs = new Set();
        const solution = this.solution;
        const len = solution.length;
        for (let i = 0; i < len; i++) {
            const wordA = solution[i];
            const wordB = solution[(i + 1) % len];
            pairs.add(`${wordA}+${wordB}`);
        }
        return pairs;
    },

    getJumbledWords() {
        // Fisher-Yates shuffle
        const words = [...this.solution];
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }
        return words;
    },

    getDateString() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    },

    getPuzzleNumber() {
        return this.puzzleIndex + 1;
    }
};
