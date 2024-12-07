const { log } = require('node:console');

log(solution1(getInput()));
log(solution2(getInput()));

function solution1(input) {
    function applyOperators(numbers, opBitbap) {
        let currOpIndex = 0;
        return numbers.reduce((a, b) => 1 << currOpIndex++ & opBitbap ? a + b : a * b);
    }

    return input.reduce((result, [value, str]) => {
        const numbers = str.split(' ').map(Number);
        const valueNum = +value;
        const operatorsBitmap = 2 ** (numbers.length - 1) - 1;
        // Loop through all operator combinations
        for (let i = operatorsBitmap; i >= 0; i--) {
            if (applyOperators(numbers, i) === valueNum) return result + valueNum;
        }
        return result;
    }, 0);
}

function solution2(input) {
    function concatIntegers(a, b) {
        let multiplier = 1;
        while (multiplier <= b) {
            multiplier *= 10;
        }
        return a * multiplier + b;
    }

    function applyOperators(numbers, operators) {
        let currOpIndex = 0;
        return numbers.reduce((a, b) => {
            switch(operators[currOpIndex++]) {
                case '0': return a + b;
                case '1': return a * b;
                case '2': return concatIntegers(a, b);
            }
        });
    }

    return input.reduce((result, [value, str]) => {
        const numbers = str.split(' ').map(Number);
        const valueNum = +value;
        const operatorCount = numbers.length - 1;

        const conbinationCount = Math.pow(3, operatorCount); // Total number of combinations

        for (let i = 0; i < conbinationCount; i++) {
            // Convert number to a base-3 string and pad with zeros to length n
            let combination = i.toString(3).padStart(operatorCount, '0');

            if (applyOperators(numbers, combination) === valueNum) return result + valueNum;
        }
                
        return result;
    }, 0);
}

function getInput() { 
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split('\n')
        .filter(s => s.trim())
        .map(s => s.split(': '));
}
