solution1();
//solution2();

function solution1() {
    let input = getInput();
    let count = input.filter(report => {
        let diffs = [];
        report.forEach((v, i, r) => i && diffs.push(v - r[i - 1]));
        if (diffs[0] < 0) diffs = diffs.map(n => -n);
        return diffs.every(n => n && !(n & ~3));        
    }).length; 

    console.log(count);
}

function getInput() {
    try {
        return require('node:fs')
            .readFileSync('./input', 'utf8')
            .split('\n')
            .filter(s => s.trim())
            .map(s => s.match(/\d+/g).map(snum => +snum));            
    } catch (err) {
        console.error(err);
    }
}
