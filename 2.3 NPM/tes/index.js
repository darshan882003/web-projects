var readline = require('readline'),
    rl = readline.createInterface({
        input: require('fs').createReadStream('./file.txt'),
        output: process.stdout,
        terminal: false
    });

rl.on('line', function(line) {
    // do something with the line of text
});

rl.on('error', function(e) {
    // something went wrong
});
