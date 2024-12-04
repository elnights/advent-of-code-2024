solution1();
solution2();

function countWord(grid, word) {
    const rows = grid.length;
    const cols = grid[0].length;
    const wordLen = word.length;
    const directions = [
        [0, 1],    // Right
        [0, -1],   // Left
        [1, 0],    // Down
        [-1, 0],   // Up
        [1, 1],    // Down-Right
        [-1, -1],  // Up-Left
        [1, -1],   // Down-Left
        [-1, 1]    // Up-Right
    ];
    
    function isValid(x, y) {
        return x >= 0 && x < rows && y >= 0 && y < cols;
    }
    
    function checkDirection(x, y, dx, dy) {
        for (let i = 0; i < wordLen; i++) {
            const nx = x + i * dx;
            const ny = y + i * dy;
            if (!isValid(nx, ny) || grid[nx][ny] !== word[i]) {
                return false;
            }
        }
        return true;
    }
    
    let count = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === word[0]) {
                for (const [dx, dy] of directions) {
                    if (checkDirection(i, j, dx, dy)) {
                        count++;
                    }
                }
            }
        }
    }
    
    return count;
}

function countX(grid, word) {
    const rows = grid.length;
    const cols = grid[0].length;
    
    let count = 0;

    for (let i = 1; i < rows - 1; i++) {
        for (let j = 1; j < cols - 1; j++) {
            if (grid[i][j] === word[1]) {
                const dia1Set = new Set([grid[i - 1][j - 1], grid[i + 1][j + 1]]);
                const dia2Set = new Set([grid[i - 1][j + 1], grid[i + 1][j - 1]]);
                if (
                    dia1Set.has(word[0]) && dia1Set.has(word[2]) &&
                    dia2Set.has(word[0]) && dia2Set.has(word[2])
                ) count++;
            }
        }
    }
    
    return count;
}

function solution1() {
    console.log(countWord(getInput(), 'XMAS'));
}

function solution2() {
    console.log(countX(getInput(), 'MAS'));
}

function getInput() {
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split('\n')
        .filter(s => s.trim())
}
