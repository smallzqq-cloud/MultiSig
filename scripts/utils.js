const fs = require('fs');

function writeFileSync(filename, content) {
    fs.writeFileSync(filename, content);
}

function readFileSync(filename) {
    let rawdata = fs.readFileSync(filename, "utf-8");
    return rawdata;
}

module.exports = {
    writeFileSync,
    readFileSync,
}