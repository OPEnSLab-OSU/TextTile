// Test file to illustrate loom-github module


var loom = require('./loom-github');


// at this point getFile only prints to stdout
loom.getFile({'file': process.argv[2]});
