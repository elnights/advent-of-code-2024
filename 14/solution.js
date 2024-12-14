'use strict';
const fs = require('node:fs');
const { log } = require('node:console');

// I assumed that the moment the image of the Christmas tree appeared
// coincided with the minimum possible safety factor.
// Initially, I printed an image of the map every time I found a new minimum safety factor.
// After a few minima, the Christmas tree appeared, and no new minima were found.
// At that point, I copied the image to use it for reference and to determine when to stop the search.

const width = 101;
const height = 103;
const yolka = fs
    .readFileSync('./yolka', 'utf8')
    .split('\n')
    .map(s => s.trim())
    .filter(s => s);

function getNewOffset(x, dx, length, time) {
    x += 1;
    x += dx * time;
    x %= length;
    if (x <= 0) x += length;
    return x - 1;
}

function getNewPos(x, y, sx, sy, time){
    return [
        getNewOffset(x, sx, width, time),
        getNewOffset(y, sy, height, time)
    ]
}

function solution1(input) {
    return getSafetyFactor(input.map(r => getNewPos(...r, 100)));
}

function print(positions) {
    const map = new Map(Array.from(Array(height), (_ , i) => [i, new Set()]));

    positions.forEach(([x, y]) => {
        map.get(y).add(x)
    })

    return Array(height).fill(0).map((_, i) =>
        Array(width).fill(0).map((_ , j) => map.get(i).has(j) ? '+' : ' ')
    );
}

function checkYolka(map) {
    const bigRows = map.length;
    const bigCols = map[0].length;
    const sampleRows = yolka.length;
    const sampleCols = yolka[0].length;

    for (let i = 0; i <= bigRows - sampleRows; i++) {
        for (let j = 0; j <= bigCols - sampleCols; j++) {
            let match = true;

            for (let x = 0; x < sampleRows; x++) {
                for (let y = 0; y < sampleCols; y++) {
                    if (map[i + x][j + y] !== yolka[x][y]) {
                        match = false;
                        break;
                    }
                }
                if (!match) break;
            }

            if (match) {
                return true;
            }
        }
    }

    return false;
}

function getSafetyFactor(positions) {
    return positions
        .reduce((quadrants, [x, y]) => {
            let midX = width >>> 1;
            let midY = height >>> 1;
            if ((midX !== x) && (midY !== y)) {
                const quadrant = ((x - midX > 0 ? 1 : 0) << 1) + (y - midY > 0 ? 1 : 0);
                quadrants[quadrant] += 1;
            }
            return quadrants;
        }, [0, 0, 0, 0])
        .reduce((acc, q)  => acc * q, 1);
}

function solution2(input) {
    let speeds = input.map(r => r.slice(2));
    let newPos = input.map(r => r.slice(0, 2));
    let minSafetyFactor = getSafetyFactor(newPos);
    let step = 0;
    while (true) {
        step++;
        newPos = newPos.map((p, i) => getNewPos(...p, ...speeds[i] , 1));
        const safetyFactor = getSafetyFactor(newPos);

        if (minSafetyFactor > safetyFactor) {
            minSafetyFactor = safetyFactor;

            if (checkYolka(print(newPos))) {
                return step;
            }
        }
    }
}

function getInput() {
    return fs
        .readFileSync('./input', 'utf8')
        .split('\n')
        .filter(s => s)
        .map(s => s.match(/(-?\d+)/g).map(Number));
}

log(solution1(getInput()));
log(solution2(getInput()));
