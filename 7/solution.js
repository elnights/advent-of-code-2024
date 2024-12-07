const { log } = require('node:console');

solution1();

function solution1() {
    const lines = getInput();

    log(lines)
}

function getInput() { 
    return require('node:fs')
        .readFileSync('./test_input', 'utf8')
        .split('\n')
        .filter(s => s.trim())
        .map(s => s.split(': '));
}
