'use strict';

const { log } = require('node:console');

function solveLinearEquations(ax, ay, bx, by, rx, ry) {
    // Calculate the determinant of the coefficient matrix
    const det = ax * by - ay * bx;

    if (det === 0) {
        throw new Error("The system of equations has no unique solution (determinant is zero).");
    }

    // Calculate an and bn using the inverse matrix method
    const an = (by * rx - bx * ry) / det;
    const bn = (-ay * rx + ax * ry) / det;

    if (Math.trunc(an) !== an || Math.trunc(bn) !== bn) {
        throw new Error("The solutions are non-integer.");
    }

    return { an, bn };
}

function solution(input, part2 = false) {
    return input.reduce((sum, conditions) => {
        conditions = conditions.match(/(\d+)/g).map(Number);
        if (part2) {
            conditions[4] += 10_000_000_000_000;
            conditions[5] += 10_000_000_000_000;
        }
        try {
            const {an, bn} = solveLinearEquations(...conditions);
            return an * 3 + bn + sum;
        } catch {
            return sum
        }
    }, 0);
}

function getInput() {
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split('\n\n');
}

log(solution(getInput()));
log(solution(getInput(), true));
