const { log } = require('node:console');

log(solution1(getInput()));
log(solution2(getInput()));

function getFileChecksum(offset, size, id) {
    return size * offset * id + (id * size * (size - 1)) / 2;
};

function solution1(diskMap) {
    let offset = 0; 
    let checksum = 0; 

    for (let i = 0, j = diskMap.length - 1; true; i += 2) {
        let fileId = i >>> 1;

        checksum += getFileChecksum(offset, diskMap[i], fileId);
        if (i >= j) return checksum;
        offset += diskMap[i];
        
        let freeLength = diskMap[i + 1];

        while (freeLength) {
            if (i >= j) return checksum;
            let chunk = Math.min(diskMap[j], freeLength);
            freeLength -= chunk;
            fileId = j >>> 1;
            checksum += getFileChecksum(offset, chunk, fileId);
            offset += chunk;
            if (!(diskMap[j] -= chunk)) j -= 2;
        }
    }
}

function sortedIndex(array, value) {
    var low = 0,
        high = array.length;

    while (low < high) {
        var mid = (low + high) >>> 1;
        if (array[mid] < value) low = mid + 1;
        else high = mid;
    }
    return low;
}

function solution2(diskMap) {
    const holes = {};
    const fileOffsets = {};

    for (let i = 0, offset = 0; i < diskMap.length; i += 2) {
        let holeSize = diskMap[i + 1],
            fileSize = diskMap[i];
        
        fileOffsets[i >>> 1] = offset;

        if (!holeSize) continue;
        offset += fileSize;
        holes[holeSize] = holes[holeSize] || [];
        holes[holeSize].push({offset, index: i + 1});
        offset += holeSize;
    }

    // moving files
    let movedFiles = {};

    for (let i = diskMap.length - 1; i >= 2; i -= 2) {
        let fileSize = diskMap[i];
        //find leftmost hole
        let acceptableHoleSizes = Object.keys(holes).filter(holeSize => +holeSize >= fileSize);
        let { holeSize, hole } = acceptableHoleSizes.reduce(
            ({ hole: leftmostHole, holeSize: leftmostHoleSize }, currentHoleSize) => {
                let currentHole = holes[currentHoleSize][0];
                return !leftmostHole || currentHole.index < leftmostHole.index
                    ? { holeSize: currentHoleSize, hole: currentHole }
                    : { holeSize: leftmostHoleSize, hole: leftmostHole };
            },
            { holeSize: null, hole: null }
        );

        if (hole && hole.index < i) {
            diskMap[i] = null;
            movedFiles[i] = {offset: hole.offset, size: fileSize};
            holes[holeSize].shift();
            if (!holes[holeSize].length) delete holes[holeSize];

            let leftFreeSpace = holeSize - fileSize;
            if (leftFreeSpace) {
                holes[leftFreeSpace] = holes[leftFreeSpace] || [];
                hole.offset += fileSize;
                holes[leftFreeSpace].splice(sortedIndex(holes[leftFreeSpace].map(hole => hole.index), hole.index), 0, hole);
            }
        }
    }

    // calculating checksum

    let offset = 0;
    let checksum = 0;

    for (let i = 0; i < diskMap.length; i += 2) {
        const fileLength = diskMap[i] ?? movedFiles[i].size;
        const freeLength = diskMap[i + 1];

        checksum += getFileChecksum(movedFiles[i]?.offset ?? offset, fileLength, i >>> 1);
        offset += fileLength + freeLength;
    }

    return checksum;
}

function getInput() { 
    return require('node:fs')
        .readFileSync('./input', 'utf8')
        .trim()
        .split('')
        .map(Number);
}
