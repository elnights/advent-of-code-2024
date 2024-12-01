solution1();
solution2();

function solution1() {
    let [A, B] = getInput();

    A.sort((a, b) => a - b);
    B.sort((a, b) => a - b);

    let totalDistance = 0;

    for (let i = 0; i < A.length; i++) {
        totalDistance += Math.abs(A[i] - B[i]);
    }

    console.log(totalDistance);
}

function solution2() {
    let [A, B] = getInput();
    let frequencies = B.reduce((freqs, b) => {
        let freq = freqs[b] || 0;
        freqs[b] = freq + 1;
        return freqs;
    }, {});
    
    let similarityScore = A.reduce((sum, entry) => sum + (frequencies[entry] || 0) * entry, 0);

    console.log(similarityScore);
}


function getInput() {
    const fs = require('node:fs');

    try {
        let data = fs
            .readFileSync('./input', 'utf8')
            .split('\n')
            .filter(s => s.trim())
            .map(s => s.match(/(\d+)\s+(\d+)/).slice(1).map(snum => +snum));  

        const A = data.map(pair => pair[0]);
        const B = data.map(pair => pair[1]);

        return [A, B];            
    } catch (err) {
        console.error(err);
    }
}
