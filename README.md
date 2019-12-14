# Delta - file uploader + url shortner

`delta` is a small hobby project that I did in my free time. It's a self-hosted file uploader + URL shortner. In short, you can fire a simple `curl` command with a file name, and that file will be uploaded to your server, after that you'll have a short url as a reponse of upload. And you can use this URL to fetch the uploaded file. Same goes with URL shortner

## Demo

[![asciicast](https://asciinema.org/a/0e4sjjrPoEMq9uu8FIYSdNwsD.svg)](https://asciinema.org/a/0e4sjjrPoEMq9uu8FIYSdNwsD)

## Features

-   :zap: File uploader backed with Superfast Expressjs and Multer
-   :file_folder: URL shortener for files (upload file ⇒ get shortened URL in return)
-   :globe_with_meridians: URL shortener for long URLS (`http://example.com/games/minecraft/world` ⇒ `http://sma.ll/6Tj`)
-   :fire: Custom URL support (`http://example.com/longurl/school/college/work` ⇒ `http://sma.ll/life`)
-   :tada: Secured with API keys
-   :family: Multiuser + Multidomain support on the same server (see [this](#multiuser))
-   :hourglass: Configurable Cron job for deleting resources older than X time
-   :1234: <b>Never Clashing (0% collision guaranteed)</b> Permanent ID's for generated URLs.
-   :bomb: self destructing links
-   :closed_lock_with_key: Password protected links
-   :ghost: Easy to install, setup and use :P

## Installation

#### Clone

```
git clone https://github.com/fosslife/delta.git
```

Or, download zip from [master](https://github.com/fosslife/delta/archive/master.zip) branch

#### Configuration

Open config.js. it has multiple things you need to configure

-   `users`: list of users with their own api-keys, name etc.
    -   `name`: Name of the user, a folder will be created with this name inside upload directory.
    -   `apiKey` : a random long string (mandatory as user identification is done with this key, can't leave empty)
    -   run `cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1` OR `date | md5sum | base64 | head -c 32` to create one
    -   `domainUrl: 'https://your.domain.url/'` Keep the trailing slash `/`
-   `timeZone`: 'Your/Timezone' This is used to run the cron job periodically according to your location
-   `uploadpath`: Absolute path where you want your files to be stored on server
-   `cron`:
    -   `schedule`: Cron schedule string, default is 1st Day of every month at 00:00
    -   `min_age`: Minimum time (days) for which file should be retained
    -   `max_age`: Maximum time (days) for which file should be retained
    -   `max_size`: Maximum file size to calculate retaintion period against (it's not max size of file to upload)
-   `dbconfig`: Redis configuration
    -   `port`: Redis server port
    -   `host`: Set via REDIS_HOST env variable for Docker, give your server URL if you are not using docker
    -   `password`: Server password
-   `port`: Port at which you want to run delta at
-   `urlLength`: length of the generated URL, 4 to 7 are considered good.
-   `urlString`: list of characters from which shortened URL is generated, you can remove I,l,4,A etc look-alike characters if you want

#### Install dependencies

There are two ways to use delta

-   [docker](#docker) method and
-   [non-docker](#redis)(direct) method

##### Docker

| although I have created basic Dockerfile and docker-compose.yml, and it works, I don't know much docker I need help with persistance storage/volume etc. If you know Docker, that'd be a great help :)

##### Redis

###### Debian/Ubuntu etc

```
sudo apt-get install redis-server
sudo systemctl enable --now redis-server.service
```

###### fedora etc

```
sudo dnf -y install redis
sudo systemctl enable --now redis
```

| for other OS: `https://www.google.com/search?q=install+redis+on+my+os`

##### Node

```
npm install # or yarn install
```

#### Enjoy

-   run `npm start` or `yarn start`! Server is started, enjoy!

If ther's something not working, please submit an issue, I will make sure I fix it in upcoming weekend :D

## Usage

If you have installed everything correctly, and server is working it's really easy to use it.

#### curl Method

Most basic method, and it will work with just simple `curl` command or alternative.

##### for files

-   Go to the directory from which you want to upload the file
-   run `curl -H 'api-key: API_KEY' -F file=@filename https://url.com/`,
-   Replace required data accordingly
    -   API_KEY - The exact key you have given on server in `config.json`
    -   filename - filename you want to upload

##### for urls

-   Just replace `-F file=@filename` part with `-d 'url=http://google.com/`. Rest of the command stays same
-   To generate custom URLs add `-d 'custom=test'` with previous command

See [Examples](#examples) for more details.

## Examples and API

Considering apiKey = 1234:

-   To upload a file called dogs.jpg

```
curl -H 'api-key: 1234' -F file=@dogs.jpg http://url.com/
```

-   To shorten a URL, say this repository

```
curl -H 'api-key: 1234' -d 'url=https://github.com/fosslife/delta.git' http://url.com/
```

-   To shorten custom URL, again this repository, to `delta`

```
curl -H 'api-key: 1234' -d 'url=https://github.com/fosslife/dekta.git' -d 'custom=delta' http://url.com/
```

-   To Shorten a URL and set automatic expiry of 15 minutes

```
curl -H 'api-key: 1234' -d 'url=https://example.com/' -d 'expires=15m'
```

-   To upload a file and lock it with password, so that only people with that password can see that file

```
curl -H 'api-key: 1234' -F file=@cats.png -F 'pass=eNcRyPt' http://url.com/
```

of course, file uploads don't have custom URLs, both files and URLs can have password and expiry duration. keep in mind expiry duration can only be in format `{number}{s|m|h|d|w|M}` (stands for Seconds, Minutes, Hours, Days, Weeks, Months respectively) like `15s` for 15 seconds, `1d` for 1 day, `2M` for two months etc.

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
        ['Spark', 'spark1234', 'https://i.spark.pepe/'],
        ['John', '1234John', 'https://john.meme/']
    ];
}
```

And, If spark makes a request to the server with his own api key, the server will store the uploaded file inside a different dir called `spark` in `uploads/` folder, and will return `https://i.sprk.pw/7HgY` as shortened URL, but if John makes a request to same server with his private api key, his files will be stored in `John` directory under `uploads/` folder, and he will get `https://john.meme/8Hy` in return :)

## Licence

delta is Licensed under [MIT](https://github.com/fosslife/sprk/blob/master/LICENSE)
