# sprk.pw file uploader

`sprk` is a small hobby project that I did in my free time. It's a file uploader + URL shortner. In short, you can fire a simple `curl` or any other equivalent command with a file name, and that file will be uploaded to your server, after that you'll have a short url as a reponse of upload. Like, if you upload your `user_environment_configuration_fedora.conf` to server, you'll have something like `small.url/y7Ac6_2.conf` in return. After than anyone with the URL with them, can access this file with a simple `GET` request, even from browser. 

## Installation

The module is a simple express server with some configuration. To set it up follow the steps:

  - checkout project with `git clone https://github.com/Sparkenstein/sprk.git` or download zip from [master](https://github.com/Sparkenstein/sprk/archive/master.zip) branch.
  - open `config.json` and made changes accordingly. it's a pretty self-descriptive JSON.
    - You'll need to add an `apiKey`. it can be anything, but having a very long and random key helps.
    - To generate such a string Use [this gist](https://gist.github.com/earthgecko/3089509) or just run `cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1` in your terminal (Linux/Mac only).  
  - install deps with `npm install` or `yarn install` or whichever tool you are using.
  - Start the server with `npm start` or `yarn start` or even `node index.js` or `PM2` whichever you prefer. 
  - Enjoy!

## Usage
If you have installed everything correctly, and server is working it's really easy to use it.

### Method - 1
Most basic method, and it will work with just simple `curl` command.
- Go to the directory from which you want to upload the file
- run `curl -H {api-key: {API_KEY}} -F file=@{filename.ext} URL`, 
- Remember to replace `{filename.ext}` with actual filename you want to upload like `cuteCat.jpg`, `{API_KEY}` with the API key you generated/used for server and `{URL}` with the URL where your server is running  (all without curly brackets). 
