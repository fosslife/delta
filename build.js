'use strict';

const { spawn } = require('child_process');
const { rmSync, stat } = require('fs');

stat('./client/build', err => {
    if (!err) {
        rmSync('./client/build', { recursive: true });
    }
});

// Build the frontend
const buildProcess = spawn('yarn', ['build'], {
    cwd: './client',
    env: {
        ...process.env,
        GENERATE_SOURCEMAP: false,
        INLINE_RUNTIME_CHUNK: false
    }
});

buildProcess.stdout.on('data', function (data) {
    console.log(data.toString('utf-8'));
});

buildProcess.stderr.on('data', console.log);

buildProcess.stderr.on('error', console.log);

buildProcess.on('close', () => {
    console.log('UI Build done');
});
