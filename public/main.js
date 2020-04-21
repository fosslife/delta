'use strict';

const URLButton = document.getElementById('urlButton');
const fileButton = document.getElementById('fileButton');
const urlInput = document.getElementById('url');
const fileInput = document.getElementById('file');
const resultDiv = document.getElementById('result');
const loader = document.getElementById('loader');

URLButton.addEventListener('click', async () => {
    const url = urlInput.value;
    if (!url) {
        alert('No URL specified');
        return;
    }
    if (resultDiv.innerHTML) {
        resultDiv.innerHTML = '';
    }
    loader.classList.remove('invisible');
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
        .catch(e => {
            console.error(e);
            loader.classList.add('invisible');
        });
    const sleep = () => new Promise(resolve => setTimeout(resolve, 2000));
    // const res = {message: "LINK"};
    await sleep();
    loader.classList.add('invisible');
    // const result = document.createElement('div');
    resultDiv.innerHTML = `<a href="${res.message}" class="border-b border-teal-500 border-dashed">${res.message}</a>`;
    console.log('RES', res);
});

fileButton.addEventListener('click', () => {
    const file = fileInput.value;
    console.log(file);
});
