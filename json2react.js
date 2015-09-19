var fs = require('fs');

var writable = fs.createWriteStream('./react_gen/test.js');
var readable = fs.createReadStream('react_template/android_template.js');

readable.pipe(writable);

writable.on('finish', function () {
    console.log("HELLO!");
});
