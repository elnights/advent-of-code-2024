const { log } = require('node:console');

solution();

function solution() {
    const [rules, updates] = getInput();

    const rulesMap = rules.reduce((map, rule) => {
        const [left, right] = rule.split('|').map(Number);
        map.set(left, (map.get(left) ?? new Set()).add(right));
        return map;
    }, new Map());

    const isBefore = (page1, page2) => rulesMap.has(page1) && rulesMap.get(page1).has(page2);

    let result1 = 0, result2 = 0;

    updates.forEach(update => {
        update = update.split(',').map(Number);
    
        if (update.every((page, i) => i === update.length - 1 || isBefore(page, update[i+1]))) {
            result1 += update[Math.floor(update.length / 2)];
        } else {
            update.sort((a, b) => isBefore(a, b) ? -1 : 1);
            result2 += update[Math.floor(update.length / 2)];
        }
    });

    log(result1);
    log(result2);
}

function getInput() { 
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .split('\n\n')
        .map(s => s.trim().split('\n'));
}
