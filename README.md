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

## How to play
First you need to create a new user and log in. After that you can go to _Players_ and select one of the listed users. You should get a popup to see if the user is able to play. Then you go to _Draw_, _Mime_ or _Explain_ and tell your team member to do the same. If you both clicked on start at the same page, the fun can begin. There is a term for one player which he has to draw, explain or mime. The other one only sees the drawing area, hears the explanation or sees the team member. 
There is a counter which tells you how much time you have left. If you guess the correct term in time you get points added to your account. After each term the teams switch roles. 


## Prerequisites
* [Git](http://git-scm.org): [Download for Windows](https://git-for-windows.github.io)
* Node.js (incl. npm): [Download](http://nodejs.org) 
## How to install
1. Download repository via `git clone https://github.com/michaelapfleger/hue-2-project.git`
2. Install dependencies via `npm install`
3. Build project via `npm start` followed by `npm run watch` in another command window
5. Open your browser window at *http://localhost:3000/*

## Known bugs
Unfortunately there are some known bugs in our project. They appear sometimes and sometimes not. For example you the user selection is not always that stable. And for a team to be able to start a game they have to be on the same page if they clicked start. And sometimes there are no terms loaded into the database. 
We tried to fix that, but the random appearance and lack of time made it very hard and impossible ;) Nevertheless we learned a whole lot about React and WebRTC and all the advantages.

## Online
We tried to deploy it with Now. It is working, but the server is too slow to send the drawn elements in appropriate time so the guesser is not receiving the whole image before the time is over. Locally, it works just fine.
</br>[https://mt-ooilhtogga.now.sh](https://mt-ooilhtogga.now.sh)


# Authors
Tamara Czakert, Michaela Pfleger
(c) Copyright 2017. All rights reserved ;)