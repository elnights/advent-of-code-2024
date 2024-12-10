const { log } = require('node:console');

const DIRECTIONS = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
];

class Point {
    constructor(x, y, map) {
        this.x = x;
        this.y = y;
        this.map = map;
        this.maxY = map.length;
        this.maxX = map[0].length;
        if(!this.checkBoundaries()) throw 'point out of boundaries';
    }

    checkBoundaries() {
        return this.x >= 0 && this.y >= 0 && this.x < this.maxX && this.y < this.maxY;
    }

    getHeight() {
        return this.map[this.y][this.x];
    }

    possibleDirections() {
        return DIRECTIONS.filter(dir => {
            try {
                this.step(dir);
                return true;
            } catch {}
            return false;
        });
    }

    step([dx, dy]) {
        let newPoint = new Point(this.x + dx, this.y + dy, this.map);
        if (newPoint.getHeight() !== this.getHeight() + 1) throw 'Can\'t get there';
        return newPoint;
    }

    isTop() {
        return this.getHeight() === 9;
    } 
}

function solution(input) {
    let score = 0, rating = 0;
    input.forEach((row, y) => {
        row.forEach((col, x) => {
            if (col) return;
            let tops = new Set();
            const waysToTop = point => {
                if (point.isTop()) {
                    tops.add(`${point.x},${point.y}`);
                    return 1;
                };
                
                return point.possibleDirections()
                    .reduce((ways, direction) => ways + waysToTop(point.step(direction)), 0);
            }

            rating += waysToTop(new Point(x, y, input));
            score += tops.size;
        });
    });

    return {score, rating};
}

function getInput() { 
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split('\n')
        .map(s => [...s].map(Number));
}

log(solution(getInput()));