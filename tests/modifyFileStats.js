/* eslint-disable */
const exec = require('child_process').exec;

const commands = []; // Paste the output of previous file here

commands.forEach(c => {
    exec(c);
})