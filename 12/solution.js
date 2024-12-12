'use strict';

// Number of corners of each region polygon == number of the region sides
// So counting the corners. 
// Checking each corner of each cell. If it's the vertex of corresponding region, do sides++

const DIRECT_VECTORS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const DIAGONAL_VECTORS  = [[-1, -1], [-1, 1], [1, 1], [1, -1]];

const { log } = require('node:console');

function solution(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const isValid = (x, y) => x >= 0 && y >= 0 && x < rows && y < cols;
    const isSameRegion = (x, y, symbol) => isValid(x, y) && grid[y][x] === symbol;

    function isOuterCorner(cx, cy, dx, dy) {
        const symbol = grid[cy][cx];
        const diagonalDifferent = !isSameRegion(cx + dx, cy + dy, symbol);
        const edge1Matches = isSameRegion(cx + dx, cy, symbol);
        const edge2Matches = isSameRegion(cx, cy + dy, symbol);
    
        return (diagonalDifferent && edge1Matches === edge2Matches) ||
               !(diagonalDifferent || edge1Matches || edge2Matches);
    }

    function scanRegion(x, y) {
        const stack = [[x, y]];
        const symbol = grid[y][x];
        let area = 0;
        let perimeter = 0;
        let vertices = 0;

        while (stack.length > 0) {
            const [cx, cy] = stack.pop();
            if (visited[cy][cx]) continue;
            visited[cy][cx] = true;

            area++;

            vertices += DIAGONAL_VECTORS.filter(([dx, dy]) => isOuterCorner(cx, cy, dx, dy)).length;

            for (const [dx, dy] of DIRECT_VECTORS) {
                const nx = cx + dx;
                const ny = cy + dy;

                if (isSameRegion(nx, ny, symbol))
                    stack.push([nx, ny]);
                else
                    perimeter++;
            }
        }

        return [area, perimeter, vertices];
    }

    let total = 0, totalWithDiscount = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const [area, perimeter, vertices] = scanRegion(j, i);
            total += area * perimeter;
            totalWithDiscount += area * vertices;
        }
    }

    return [total, totalWithDiscount];
}

function getInput() { 
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split('\n')
        .map(s => s.split(''));
}

log(solution(getInput()));
