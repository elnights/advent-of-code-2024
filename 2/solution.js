solution1();
solution2();

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

function solution2() {
    function isDiffValid(direction, diff) {
        let currDirection = getDirection(diff);

        return direction === currDirection && diff && Math.abs(diff) <= 3;
    }

    function getDirection(diff) {
        return Math.sign(diff);
    }

    let input = getInput();
    let count = input.filter(report => {
        let direction, dampenerUsed = false;

        let diffs = [];
        report.forEach((v, i, r) => i && diffs.push(v - r[i - 1]));

        // working with diffs between current and previous levels
        // starting from diff 0 which represents report level 1
        for (let i = 0; i < diffs.length; i++) {
            direction ??= getDirection(diffs[i]);

            if (!isDiffValid(direction, diffs[i])) {
                if (dampenerUsed) return false;
                dampenerUsed = true;
                // check fix by removing previous level
                // (adding current diff to previous one to get diff without prev level)
                if (i === 1) {
                    let newDiff = diffs[0] + diffs[1],
                    newDirection = getDirection(newDiff);
                
                    if (isDiffValid(newDirection, newDiff) && (diffs.length < 3 || isDiffValid(newDirection, diffs[2]))) {
                        direction = newDirection;
                        continue;
                    }
                } else 
                
                if (!i && isDiffValid(getDirection(diffs[1]), diffs[1]) && (diffs.length < 3 || isDiffValid(getDirection(diffs[1]), diffs[2]))) {
                    direction = getDirection(diffs[1]);
                    continue;
                } else

                if (isDiffValid(direction, diffs[i-1] + diffs[i]) && (diffs.length < i+2 || isDiffValid(direction, diffs[i+1]))) {
                    continue;
                }

                // removing current level
                if (i < diffs.length - 1) {
                    diffs[i+1] += diffs[i];
                    // if first diff removed, it's not late to change direction
                    if (!i) direction = getDirection(diffs[i + 1]);
                }
            }
 
        }

        return true;
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
