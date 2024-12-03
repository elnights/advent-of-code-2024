solution1();
solution2();

function process(input) {
    return input
        .match(/mul\(\d{1,3},\d{1,3}\)/g)
        .map(mulString => mulString.match(/\d{1,3}/g))
        .map(([a, b]) => +a * +b)
        .reduce((sum, x) => sum + x, 0)
}

function solution1() {
    console.log(process(getInput()));
}

function solution2() {
    let input = getInput();
    
    let c = input.split('do()')
        .map(doStr => doStr.split("don\'t()")[0])
        .map(process)
        .reduce((sum, x) => sum + x, 0);
    
    console.log(c);
}

function getInput() {
    try {
        return require('node:fs')
            .readFileSync('./input', 'utf8')
            .trim('\n');            
    } catch (err) {
        console.error(err);
    }
}
