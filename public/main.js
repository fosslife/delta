'use strict';

const URLButton = document.getElementById('urlButton');
const fileButton = document.getElementById('fileButton');
const urlInput = document.getElementById('url');
const fileInput = document.getElementById('file');
const resultDiv = document.getElementById('result');

URLButton.addEventListener('click', async () => {
    const url = urlInput.value;
    if (!url) {
        alert('No URL specified');
        return;
    }
    const headers = new Headers({
        'api-key': 'spark1234',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
    });
    const res = await fetch('/', {
        method: 'POST',
        headers: headers,
        body: `url=${url}`
    })
        .then(d => d.json())
        .catch(console.error);
    // const result = document.createElement('div');
    resultDiv.innerHTML = res.message;
    console.log('RES', res);
});

fileButton.addEventListener('click', () => {
    const file = fileInput.value;
    console.log(file);
});
