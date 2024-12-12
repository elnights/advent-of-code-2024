'use strict';

const { log } = require('node:console');

function solution(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    function isOuterCorner(cx, cy, dx, dy) {
        const regionChar = grid[cy][cx];
        const cornerX = cx + dx;
        const cornerY = cy + dy;
        const edge1X = cx + dx;
        const edge1Y = cy;
        const edge2X = cx;
        const edge2Y = cy + dy;

        const diagonalOutOfBounds =
            cornerX < 0 || cornerY < 0 || cornerX >= rows || cornerY >= cols;
        const diagonalDifferent =
            diagonalOutOfBounds || grid[cornerY][cornerX] !== regionChar;

        const edge1IsSameRegion =
            edge1X >= 0 &&
            edge1Y >= 0 &&
            edge1X < rows &&
            edge1Y < cols &&
            grid[edge1Y][edge1X] === regionChar;

        const edge2IsSameRegion =
            edge2X >= 0 &&
            edge2Y >= 0 &&
            edge2X < rows &&
            edge2Y < cols &&
            grid[edge2Y][edge2X] === regionChar;

        return (
            diagonalDifferent && (edge1IsSameRegion === edge2IsSameRegion)
            || 
            !(diagonalDifferent || edge1IsSameRegion || edge2IsSameRegion)
        );
    }

    function floodFill(x, y) {
        const stack = [[x, y]];
        visited[y][x] = true;
        const symbol = grid[y][x];
        let area = 0;
        let perimeter = 0;
        let vertices = 0;

        while (stack.length > 0) {
            const [cx, cy] = stack.pop();
            area++;
            let edges = 0;

            if (isOuterCorner(cx, cy, -1, -1)) vertices++; // Top-left
            if (isOuterCorner(cx, cy, -1, 1)) vertices++; // Bottom-left
            if (isOuterCorner(cx, cy, 1, -1)) vertices++; // Top-right
            if (isOuterCorner(cx, cy, 1, 1)) vertices++; // Bottom-right

            for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                const nx = cx + dx;
                const ny = cy + dy;

                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
                    if (grid[ny][nx] === symbol) {
                        if (!visited[ny][nx]) {
                            visited[ny][nx] = true;
                            stack.push([nx, ny]);
                        }
                    } else {
                        edges++; // Neighbor is a different symbol
                    }
                } else {
                    edges++; // Out of bounds (boundary edge)
                }
            }

            perimeter += edges;
        }

        return [area, perimeter, vertices];
    }

    let total = 0, totalWithDiscount = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j]) {
                const [area, perimeter, vertices] = floodFill(j, i);
                total += area * perimeter;
                totalWithDiscount += area * vertices;
            }
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
