const { log } = require('node:console');
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

log(solution1(getInput()));
log(solution2(getInput()));

function solution1(input) {
    return solution(input);
}

function solution2(input) {
    return solution(input, true);
}

function solution(input, resonantHarmonics = false) {
    let fMap = {};
    
    input.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol !== '.') {
                if (!fMap[symbol]) fMap[symbol] = [];
                fMap[symbol].push([j, i]);
            }
        });
    });

    const maxY = input.length;
    const maxX = input[0].length;

    const antinodes = new Set();

    for (let freq in fMap) {
        findAntinodes(fMap[freq]);
    }

    return antinodes.size;

    function addAntinode(x, y) {
        if (x >= 0 && x < maxX && y >= 0 && y < maxY) {
            antinodes.add(`${x}:${y}`);
            return true;
        }
        return false;
    }

    function findAntinodes(antennas) {
        for (let i = 0; i < antennas.length; i++) {
            for (let j = i + 1; j < antennas.length; j++) {
                const [x1, y1] = antennas[i];
                const [x2, y2] = antennas[j];
    
                const dx = x2 - x1;
                const dy = y2 - y1;
    
                if (!resonantHarmonics) {
                    addAntinode(x1 - dx, y1 - dy);
                    addAntinode(x2 + dx, y2 + dy);
                } else {
                    // Simplify the direction vector using GCD
                    const step = gcd(Math.abs(dx), Math.abs(dy));
                    const stepX = dx / step;
                    const stepY = dy / step;

                    // Step backward from (x1, y1)
                    let x = x1;
                    let y = y1;
                    while (addAntinode(x, y)) {
                        x -= stepX;
                        y -= stepY;
                    }

                    // Step forward from (x2, y2)
                    x = x2;
                    y = y2;
                    while (addAntinode(x, y)) {
                        x += stepX;
                        y += stepY;
                    }
                }
            }
        }
    }
}

function getInput() { 
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split('\n')
        .filter(s => s)
        .map(s => s.split(''));
}
