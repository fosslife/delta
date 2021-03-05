/* eslint-disable */
'use strict';

async function upload(e) {
    const files = e.target.files;
    const formData = new FormData();
    formData.append('file', files[0]);

    const res = await fetch('/', {
        method: 'POST',
        headers: {
            'x-delta-type': 'file',
            'api-key': 'spark1234'
        },
        body: formData
    })
        // .then(response => response.json())
        .then(data => data.text())
        .catch(error => {
            console.error(error);
        });
    console.log(res);
}
