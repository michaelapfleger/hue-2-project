# Project 2 HUE

## Team:
Michaela Pfleger, Tamara Czakert

## Requirements: 
- Web Application
- React.js + Webpack
- Should use your own node.js server (if necessary)
- Do not directly copy something that already exists - be creative! (I know, that’s a hard one - especially a second time)
- Should be available offline OR use WebRTC

## Idea:
Small game for at two teams with two players each. One player of the team gets a term which he has to draw on the screen. The other one has to guess which term is drawn. There should be a limitation in time. The guesser gets points if he is right. Then the teams switch.


## Technologies used:
* React.js
* Redux 
* Webpack
* Node.js
* Firebase
* WebRTC
* Websockets
* ESLint
* Now Deploy
* Material UI from [https://material-ui.com](https://material-ui.com) 
* Material Design Icons from [https://material.io/icons/](https://material.io/icons/)
* Sounds from [http://www.freesound.org/](http://www.freesound.org/)




## Usage:
## Prerequisites
* [Git](http://git-scm.org): [Download for Windows](https://git-for-windows.github.io)
* Node.js (incl. npm): [Download](http://nodejs.org) 
## How to install
1. Download repository via `git clone https://github.com/michaelapfleger/hue-2-project.git`
2. Install dependencies via `npm install`
3. Build project via `npm start` followed by `npm run watch` in another command window
5. Open your browser window at *http://localhost:3000/*


## Online: 
We tried to deploy it with Now. It is working, but the server is too slow to send the drawn elements in appropriate time so the guesser is not receiving the whole image before the time is over. Locally, it works just fine.
[https://mt-ooilhtogga.now.sh](https://mt-ooilhtogga.now.sh)


# Authors
Tamara Czakert, Michaela Pfleger
(c) Copyright 2017. All rights reserved ;)