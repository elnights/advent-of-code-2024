'use strict';

const { log } = require('node:console');

const width = 101;
const height = 103;
const time = 100;

function getNewOffset(x, dx, length) {
    x += 1;
    x += dx * time;
    x %= length;
    if (x <= 0) x += length;
    return x - 1;
}

function getNewPos(x, y, sx, sy){
    return [
        getNewOffset(x, sx, width),
        getNewOffset(y, sy, height)
    ]
}

function solution1(input) {
    return input
        .map(r => getNewPos(...r))
        .reduce((quadrants, [x, y]) => {
            let midX = width >>> 1;
            let midY = height >>> 1;
            if ((midX !== x) && (midY !== y)) {
                const quadrant = ((x - midX > 0 ? 1 : 0) << 1) + (y - midY > 0 ? 1 : 0);
                quadrants[quadrant] += 1;
            }
            return quadrants;
        }, [0, 0, 0, 0])
        .reduce((acc, q)  => acc * q, 1)
}

function getInput() {
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split('\n')
        .filter(s => s)
        .map(s => s.match(/(-?\d+)/g).map(Number));
}

log(solution1(getInput()));

