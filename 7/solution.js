const { log } = require('node:console');

solution1();
solution2();

function solution1() {
    function applyOperators(numbers, opBitbap) {
        let currOpIndex = 0;
        return numbers.reduce((a, b) => 1 << currOpIndex++ & opBitbap ? a + b : a * b);
    }

    const result = getInput().reduce((result, [value, str]) => {
        const numbers = str.split(' ').map(Number);
        const valueNum = +value;
        const operatorsBitmap = 2 ** (numbers.length - 1) - 1;
        // Loop through all operator combinations
        for (let i = operatorsBitmap; i >= 0; i--) {
            if (applyOperators(numbers, i) === valueNum) return result + valueNum;
        }
        return result;
    }, 0);

    log(result);
}

function solution2() {
    function* combinations(n, symbols) {
        const max = Math.pow(symbols.length, n); // Total number of combinations
    
        for (let i = 0; i < max; i++) {
            // Convert number to a base-N string and pad with zeros to length n
            const baseString = i.toString(symbols.length).padStart(n, "0");
    
            // Map digits from base-0 (0,1,2) to symbols
            yield [...baseString].map(d => symbols[d]);
        }
    }

    function applyOperators(numbers, operators) {
        let currOpIndex = 0;
        return numbers.reduce((a, b) => {
            switch(operators[currOpIndex++]) {
                case '|': return +(a.toString() + b.toString());
                case '+': return a + b;
                case '*': return a * b;
            }
        });
    }

    const result = getInput().reduce((result, [value, str]) => {
        const numbers = str.split(' ').map(Number);
        const valueNum = +value;

        for (const combination of combinations(numbers.length - 1, ['+', '*', '|'])) 
            if (applyOperators(numbers, combination) === valueNum) return result + valueNum;
        
        return result;
    }, 0);

    log(result);
}

function getInput() { 
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split('\n')
        .filter(s => s.trim())
        .map(s => s.split(': '));
}
