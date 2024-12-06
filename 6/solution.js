const { log } = require('node:console');

log(solution1(getInput()));
log(solution2(getInput()));



function solution1(input) {
    return countVisitedCells(input);

}

function solution2(input) {
   return findCycleObstaclePositions(input);
}

function findCycleObstaclePositions(mapArray) {
    const directions = [
        [-1, 0], // up
        [0, 1],  // right
        [1, 0],  // down
        [0, -1]  // left
    ];
    const dirSymbols = ['^', '>', 'v', '<'];
    const rows = mapArray.length;
    const cols = mapArray[0].length;

    // Helper to simulate guard's movement and record the original route
    function simulateRoute(map) {
        let guardPos = null;
        let currentDir = null;

        // Find guard starting position and direction
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (dirSymbols.includes(map[r][c])) {
                    guardPos = [r, c];
                    currentDir = dirSymbols.indexOf(map[r][c]);
                    break;
                }
            }
            if (guardPos) break;
        }

        const visited = new Set();
        while (true) {
            const [r, c] = guardPos;
            const [dr, dc] = directions[currentDir];
            const nextPos = [r + dr, c + dc];

            // Check if out of bounds
            if (nextPos[0] < 0 || nextPos[0] >= rows || nextPos[1] < 0 || nextPos[1] >= cols) {
                break; // Guard exits the map
            }

            // Check if the next cell is an obstacle
            if (map[nextPos[0]][nextPos[1]] === '#') {
                // Turn right
                currentDir = (currentDir + 1) % 4;
            } else {
                // Move forward
                guardPos = nextPos;
                visited.add(`${guardPos[0]},${guardPos[1]}`);
            }
        }

        return Array.from(visited).map(pos => pos.split(',').map(Number)); // Convert set to array of coordinates
    }

    // Helper to simulate movement with an obstacle
    function simulateWithObstacle(map, obstaclePos) {
        let guardPos = null;
        let currentDir = null;

        // Copy map and place the obstacle
        const tempMap = map.map(row => row.split(''));
        tempMap[obstaclePos[0]][obstaclePos[1]] = '#';

        // Find guard starting position and direction
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (dirSymbols.includes(tempMap[r][c])) {
                    guardPos = [r, c];
                    currentDir = dirSymbols.indexOf(tempMap[r][c]);
                    break;
                }
            }
            if (guardPos) break;
        }

        const visitedStates = new Set();
        while (true) {
            const [r, c] = guardPos;
            const [dr, dc] = directions[currentDir];
            const nextPos = [r + dr, c + dc];

            // Check if out of bounds
            if (nextPos[0] < 0 || nextPos[0] >= rows || nextPos[1] < 0 || nextPos[1] >= cols) {
                return false; // Guard exited the map
            }

            // Check if the next cell is an obstacle
            if (tempMap[nextPos[0]][nextPos[1]] === '#') {
                // Turn right
                currentDir = (currentDir + 1) % 4;
            } else {
                // Move forward
                guardPos = nextPos;

                // Encode state as "row,col,direction"
                const state = `${guardPos[0]},${guardPos[1]},${currentDir}`;
                if (visitedStates.has(state)) {
                    return true; // Cycle detected
                }
                visitedStates.add(state);
            }
        }
    }

    // Step 1: Get the original route of the guard
    const originalRoute = simulateRoute(mapArray);

    // Step 2: Test placing obstacles on the original route
    let cyclePositions = 0;
    for (const [r, c] of originalRoute) {
        if (mapArray[r][c] === '.') { // Only consider empty cells
            if (simulateWithObstacle(mapArray, [r, c])) {
                cyclePositions++;
            }
        }
    }

    return cyclePositions;
}

function countVisitedCells(mapArray) {
    const directions = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1]
    ];
    const dirSymbols = ['^', '>', 'v', '<'];

    
    let guardPos = null;
    let currentDir = null;

    for (let r = 0; r < mapArray.length; r++) {
        for (let c = 0; c < mapArray[r].length; c++) {
            if (dirSymbols.includes(mapArray[r][c])) {
                guardPos = [r, c];
                currentDir = dirSymbols.indexOf(mapArray[r][c]);
                break;
            }
        }
        if (guardPos) break;
    }

    const visited = new Set([`${guardPos[0]},${guardPos[1]}`]);
    const rows = mapArray.length;
    const cols = mapArray[0].length;

    while (true) {
        // Move the guard
        const [r, c] = guardPos;
        const [dr, dc] = directions[currentDir];
        const nextPos = [r + dr, c + dc];

        // Check if out of bounds
        if (nextPos[0] < 0 || nextPos[0] >= rows || nextPos[1] < 0 || nextPos[1] >= cols) {
            break;
        }

        // Check if the next cell is an obstacle
        if (mapArray[nextPos[0]][nextPos[1]] === '#') {
            // Turn right
            currentDir = (currentDir + 1) % 4;
        } else {
            // Move forward
            guardPos = nextPos;
            visited.add(`${guardPos[0]},${guardPos[1]}`);
        }
    }

    return visited.size;
}

function getInput() {
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split('\n')
        .filter(s => s.trim())
}
