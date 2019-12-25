'use strict';

const URLButton = document.querySelector('#urlButton');
const fileButton = document.querySelector('#fileButton');
const urlInput = document.querySelector('#url');
const fileInput = document.querySelector('#file');

URLButton.addEventListener('click', async () => {
    const url = urlInput.value;
    if (!url) {
        alert('No URL specified');
        return;
    }
    const res = await fetch('/', {
        method: 'POST',
        headers: {
            'api-key': 'spark1234',
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        body: `url=${url}`
    })
        .then(d => d.json())
        .catch(console.error);
    console.log(res);
});

fileButton.addEventListener('click', () => {
    const file = fileInput.value;
    console.log(file);
});
