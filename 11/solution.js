'use strict';

const { log } = require('node:console');

function solution(input, times) {
    let memo = new Map();

    return input.reduce((sum, stone) => sum + processStone(stone, times), 0);
    
    function processStone(value, times) {
        if (!times) return 1;

        let cachedStoneCount = memo.get(`${value},${times}`);
        if (cachedStoneCount) {
            return cachedStoneCount;
        }

        const timesLeft = times - 1;
        let result;

        if (value === 0) {
            result = processStone(1, timesLeft);
        } else {
            let stoneStr = value.toString();

            result = stoneStr.length & 1 ? // odd length
                 processStone(value * 2024, timesLeft) :
                 processStone(+stoneStr.slice(0, stoneStr.length >>> 1), timesLeft) + 
                    processStone(+stoneStr.slice(stoneStr.length >>> 1), timesLeft);
        }

        memo.set(`${value},${times}`, result);

        return result;
    }
}

function getInput() { 
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split(' ')
        .map(Number);
}

log(solution(getInput(), 25));
log(solution(getInput(), 75));
