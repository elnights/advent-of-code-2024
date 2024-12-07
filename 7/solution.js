const { log } = require('node:console');

solution1();

function solution1() {
    function applyOperators(str, opBitbap) {
        const getOp = opIndex => 1 << opIndex & opBitbap ? '+' : '*';
        let currOpIndex = 0;
        return str.replace(/\s+/g, () => getOp(currOpIndex++));
    }

    const result = getInput().reduce((result, [value, str]) => {
        const numbers = str.split(' ');
        const valueNum = +value;
        const operatorsBitmap = 2 ** (numbers.length - 1) - 1;
        // Loop through all operator combinations
        for (let i = operatorsBitmap; i >= 0; i--) {
            let exp = applyOperators(str, i)
            //log(exp)
            if (eval(exp) === valueNum) return result + valueNum;
        }
        return result;
    }, 0);

    log(result)
}

function getInput() { 
    return require('node:fs')
        .readFileSync('./test_input', 'utf8')
        .split('\n')
        .filter(s => s.trim())
        .map(s => s.split(': '));
}
