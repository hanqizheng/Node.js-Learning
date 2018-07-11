//解压
const fs = require('fs');
const zlib = require('zlib');

const gunzip = zlib.createGunzip();

const inFile = fs.createReadStream('./new/TestFile');
const outFile = fs.createWriteStream('./new/TestFile');

inFile.pipe(gunzip).pipe(outFile);