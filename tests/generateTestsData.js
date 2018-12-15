/* eslint-disable */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const apendFile = util.promisify(require('fs').appendFile);
const id = require('shortid');
const lorem = require('lorem-ipsum');
const { format } =  require('date-fns');

function generateRandomDate(start, end){
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const execCommands = [];

for (let i=0; i<30; i++){
    const filename = id.generate() + '.txt';
    const randomDate = format(generateRandomDate(new Date("1 Nov 2018"), new Date("10 Dec 2018")), "YYYYMMDDhhmm");
    // exec('touch -a -m -t ' + randomDate + ' testUploads/' + filename).catch(err => console.error(err));
    const lor = lorem(({ count:  Math.floor(Math.random() * 5000),units: 'paragraphs'}));
    apendFile('testUploads/' + filename, lor).catch(err => console.error(err));
    const execString = 'touch -a -m -t ' + randomDate + ' testUploads/' + filename;
    execCommands.push(execString);
}

console.log(execCommands);

// testUploads