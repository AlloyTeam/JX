var fs = require('fs');

var dirs = fs.readdirSync('../src');
for(var i in dirs){
    console.log(dirs[i]);
}