# Delta - file uploader + url shortner

`delta` is a small hobby project that I did in my free time. It's a self-hosted file uploader + URL shortner. In short, you can fire a simple `curl` or any other equivalent command with a file name, and that file will be uploaded to your server, after that you'll have a short url as a reponse of upload. And you can use this URL to fetch the uploaded file.

Ex: if you upload your `user_environment.conf` to server, you'll have something like `sma.ll/y7A` in return (where `sma.ll` is your server). After than anyone with the URL (optionally password), can access this file with a simple `GET` request, even from browser.

## Demo

[![asciicast](https://asciinema.org/a/0e4sjjrPoEMq9uu8FIYSdNwsD.svg)](https://asciinema.org/a/0e4sjjrPoEMq9uu8FIYSdNwsD)

## Features

-   :zap: File uploader backed with Superfast Expressjs
-   :file_folder: URL shortener for files (upload file ⇒ get shortened URL in return)
-   :globe_with_meridians: URL shortener for long URLS (`http://example.com/games/minecraft/world` ⇒ `http://sma.ll/6Tj`)
-   :fire: Custom URL support (`http://example.com/longurl/school/college/work` ⇒ `http://sma.ll/life`)
-   :tada: Secured with API keys
-   :family: Multiuser + Multidomain support on the same server (see [this](#multiuser))
-   :collision: Configurable Cron job for deleting resources older than X time
-   :1234: "Never Clashing" Permanent ID's for generated URLs. they are not random, but infact incremental so no worries of clashing two URLs and also URLs are non back traceable, i.e. URL generator shuffles them randomly everytime server starts.
-   Coming
    -   password protection
    -   file encryption

## Installation

The module is a simple express server with some configuration. To set it up follow the steps:

#### Checkout project

-   `git clone https://github.com/fosslife/delta.git` OR
-   Download zip from [master](https://github.com/fosslife/delta/archive/master.zip) branch

#### Configuration

Open config.js. it has multiple things you need to configure

-   `users`: list of users with their own api-keys, name etc. Each user is another list of 1.User name 2. apiKey and 3. his own domain URL. eg: users: `[ ['John', 'abcd1234!@#', 'http://abcd.com/'], ..another user ]`
    -   `name`: delta will categorize this users files in a seperate folder with this name. i.e. `John`'s files will be stored in folder called "john" and `Jack`'s will be in folder called "jack" etc.
    -   `apiKey` : a random long string
        To generate a random string, you can run
        `cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1`
        or
        `date | md5sum | base64 | head -c 32`
    -   `domainUrl: 'https://your.domain.url/'` Keep the trailing slash `/`
-   `timeZone`: 'Your/Timezone' This is used to run the cron job periodically according to your location

#### Install dependencies

-   Run `npm install` or `yarn install` or your favourite other tool :P
-   make sure you have redis installed on your OS.

#### Enjoy

-   run `npm start` or `yarn start`! Server is started, enjoy!

## Usage

If you have installed everything correctly, and server is working it's really easy to use it.

#### curl Method

Most basic method, and it will work with just simple `curl` command or alternative.

##### for files

-   Go to the directory from which you want to upload the file
-   run `curl -H 'api-key: API_KEY' -F file=@filename https://url.com/`,
-   Replace required data accordingly
    -   API_KEY ⭢ The exact key you have given on server in `config.json`
    -   filename ⭢ filename you want to upload

##### for urls

-   Just replace `-F file=@filename` part with `-d 'url=http://google.com/`. Rest of the command stays same
-   To generate custom URLs add `-d 'custom=test'` with previous command

See [Examples](#examples) for more details.

## Examples

Considering apiKey = 1234:

-   To upload a file called dogs.jpg
    ⇒ `curl -H 'api-key: 1234' -F file=@dogs.jpg http://url.com/`
-   To shorten a URL, say this repository
    ⇒ `curl -H 'api-key: 1234' -d 'url=https://github.com/fosslife/delta.git' http://url.com/`
-   To shorten custom URL, again this repository, to `delta`
    ⇒ `curl -H 'api-key: 1234' -d 'url=https://github.com/fosslife/dekta.git' -d 'custom=dlta' http://url.com/`

## Multiuser

delta is a private file uploader, and it's supposed to be used for personal use only. Unlike many other famous file uploaders it's not open to all. for that purpose, you can just keep your API key simple like `a` or something and distribute it publicly somewhere so that everyone can use your servers instance.
But what if you don't want to distribute your api key but still let other people use the server? what if each users data is supposed to be stored in different directory? what if other users don't want your hostname in return but something different?
:grin: delta supports all of it. `multiuser` branch lets you host delta for multiple users on the same instance. just edit the given `config.json` and you are good to go. The structure of `config.json` is a littlebit different than that of master branch

-   Everything is inside a `users` array
-   First element represents the name of the user.
    -   this will be used to create different directories to store the uploaded files for each user.
    -   keep this parameter same for those users you want to store files in the same directory
-   Second parameter is apiKey, this can be different for each user
-   third paramter is the server name which will be returned as a short URL as a response.

Example:
this is current configuration:

```js
{
    users: [
        ['spark', '1234', 'https://i.sprk.pw/'],
        ['Pavan', 'abcd', 'https://pwnj.pw/']
    ];
}
```

And, If spark makes a request to the server with his own api key, the server will store the uploaded file inside a different dir called `spark` in `uploads/` folder, and will return `https://i.sprk.pw/7HgY` as shortened URL, but if Pavan makes a request to same server with his private api key, his files will be stored in `Pavan` directory under `uploads/` folder, and he will get `https://pwnj.pw/8Hy` in return :)

## Licence

delta is Licensed under [MIT](https://github.com/fosslife/sprk/blob/master/LICENSE)
