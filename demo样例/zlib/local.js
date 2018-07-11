//压缩
const fs = require('fs');
const zlib = require('zlib');

const gzip = zlib.createGzip();

const inFile = fs.createReadStream('./new/TestFile');
const out = fs.createWriteStream('./new/TestFile');

inFile.pipe(gzip).pipe(out);