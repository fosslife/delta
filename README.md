# sprk.pw file uploader

`sprk` is a small hobby project that I did in my free time. It's a self-hosted file uploader + URL shortner. In short, you can fire a simple `curl` or any other equivalent command with a file name, and that file will be uploaded to your server, after that you'll have a short url as a reponse of upload. Like, if you upload your `user_environment_configuration_fedora.conf` to server, you'll have something like `sma.ll/y7A` in return. where `sma.ll` is your server. After than anyone with the URL with them, can access this file with a simple `GET` request, even from browser. 

## Demo

[![asciicast](https://asciinema.org/a/0e4sjjrPoEMq9uu8FIYSdNwsD.svg)](https://asciinema.org/a/0e4sjjrPoEMq9uu8FIYSdNwsD)

## Features
 -  :zap: File uploader backed with Superfast Expressjs
 - :file_folder: URL shortener for files (upload file ⇒ get shortened URL in return)
 - :globe_with_meridians: URL shortener for long URLS (`url.com/games/minecraft/world` ⇒ `/6Tj`)
 - :fire: Custom URL support (`url.com/longurl/school/college/work` ⇒ `/life`)
 - :tada: Secured with API keys 
 - :family: Multiuser + Multidomain support on the same server (see [this](#multiuser))
 - :collision: Configurable Cron job for deleting resources older than X time
 - :1234: Permanent ID's for generated URLs. they are not random, but infact incremental so no worries of clashing two URLs

## Installation

The module is a simple express server with some configuration. To set it up follow the steps:

##### Checkout project
  - `git clone https://github.com/Sparkenstein/sprk.git` OR
  - Download zip from [master](https://github.com/Sparkenstein/sprk/archive/master.zip) branch
##### Configuration
  - `apiKey : 'RANDOM_LONG_STRING'`
    To generate a random string, you can run 
    `cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1`
    or 
    `date | md5sum | base64 | head -c 32`
  - `domainUrl: 'https://your.domain.url/'` Keep the trailing slash `/`
  - `env: 'PROD'` when deploying on a server, otherwise keep it as it is
  - `timeZone: 'Your/Timezone'` This is used to run the cron job periodically according to your location
##### Install dependencies
  - Run `npm install` or `yarn install` or your favourite other tool :P
##### Enjoy
  - Server is started, enjoy!
## Usage
If you have installed everything correctly, and server is working it's really easy to use it.


##### curl Method

Most basic method, and it will work with just simple `curl` command.
- Go to the directory from which you want to upload the file
- run `curl -H {api-key: {API_KEY}} -F file=@{filename.ext} URL`, 
- Remember to replace `{filename.ext}` with actual filename you want to upload like `cuteCat.jpg`, `{API_KEY}` with the API key you generated/used for server and `{URL}` with the URL where your server is running  (all without curly brackets). 


## Licence

sprk is Licensed under [MIT](https://github.com/Sparkenstein/sprk/blob/master/LICENSE)
