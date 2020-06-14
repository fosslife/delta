const axios = require('axios');
const ora = require('ora');

const [, , serverUrl, apiKey] = process.argv;

if (!serverUrl) {
    console.log(
        'Please provide server URL as first argument `node test.js http://localhost:3000/`'
    );
    process.exit(1);
}

if (!apiKey) {
    console.log(
        'Please provide API key as second argument `node test.js http://localhost:3000/ abcd1234`'
    );
    process.exit(1);
}

main();

async function main() {
    // Spinners
    const first = ora('Testing Basic URL');
    const second = ora('Testing Custom URL');
    const third = ora('Testing password protected URLs');
    const fourth = ora('Testing auto expiry');

    //#region requests basic
    first.start();
    const res1 = await axios({
        method: 'POST',
        url: serverUrl,
        headers: {
            'api-key': apiKey
        },
        data: {
            url: 'https://github.com/fosslife/delta'
        }
    });
    if (res1.status === 200) {
        first.succeed();
    } else {
        first.fail();
        process.exit(1);
    }
    //#endregion

    //#region request custom
    second.start();
    const customUrl = `custom-${Math.floor(Math.random() * 10000)}`;
    const res2 = await axios({
        method: 'POST',
        url: serverUrl,
        headers: {
            'api-key': apiKey
        },
        data: {
            url: 'https://github.com/fosslife/delta',
            custom: customUrl
        }
    });
    if (
        res2.status === 200 &&
        res2.data.split('/')[3].trim() === customUrl.trim()
    ) {
        second.succeed();
    } else {
        second.fail();
        process.exit(1);
    }
    //#endregion

    //#region request password protection
    third.start();
    const res3 = await axios({
        method: 'POST',
        url: serverUrl,
        headers: {
            'api-key': apiKey
        },
        data: {
            url: 'https://github.com/fosslife/delta',
            pass: '12345'
        }
    });
    try {
        const url = res3.data.trim();
        await axios.get(url);
    } catch (e) {
        // console.log(e.response.headers['www-authenticate']);
        if (res3.status === 200) {
            if (
                e.response.status === 401 &&
                e.response.headers['www-authenticate']
            ) {
                third.succeed();
            } else {
                third.fail(
                    e.status +
                        '  <===> ' +
                        e.response.headers['www-authenticate']
                );
                process.exit(1);
            }
        } else {
            third.fail('first fetch failed');
            process.exit(1);
        }
    }

    //#endregion

    fourth.start();
    const { promisify } = require('util');
    const sleep = promisify(setTimeout);

    const res4 = await axios({
        method: 'POST',
        url: serverUrl,
        headers: {
            'api-key': apiKey
        },
        data: {
            url: 'https://github.com/fosslife/delta',
            expires: '3s'
        }
    });
    if (res4.status === 200) {
        await sleep(5000);
        try {
            const expiryReq = await axios.get(res4.data);
            if (
                expiryReq.status === 200 &&
                expiryReq.data ===
                    'Incorrect link or record is expired and cleaned by cron'
            ) {
                fourth.succeed();
            } else {
                fourth.fail();
            }
        } catch (e) {
            fourth.fail();
        }
    } else {
        fourth.fail();
        process.exit(1);
    }
}

process.on('unhandledRejection', e => {
    console.error(e);
    process.exit(1);
});
process.on('uncaughtException', e => {
    console.error(e);
    process.exit(1);
});
