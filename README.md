# Barkbaud

Blackbaud NXT API / Sky UX demo application for bbcon 2015.

## About

This demo was built to showcase the Blackbaud NXT API and Blackbaud Sky UX.  Both technologies function completely independant of one another.  

The Blackbaud NXT API currently supports the [Authorization Code Flow](https://apidocs.nxt.blackbaud-dev.com/docs/authorization/), which requires us to have a back-end server component where we're able to securely store the client secret.  We've implemented the server component using NodeJS, which we automatically deploy to Heroku.

Our front-end is stored and built in the [barkbaud-ui repo](https://github.com/blakbaud/barkbaud-ui).  Using Bower, we consume the built ui and move it to the ui folder during our deployment process.

## Try

[https://glacial-mountain-6366.herokuapp.com](https://glacial-mountain-6366.herokuapp.com)

Feel free to leave feedback by filing an issue.

## Run Barkbaud on your server

Feel free to checkout the live demo of our application, or if you wish to run this application in your environment, you will need to complete the following steps:

### Prerequisites

0. A server capable of running NodeJS.
0. [Register your application](https://developer.nxt.blackbaud-dev.com/apps) in order to obtain the client id and client secret.
0. [Signup (for free)](https://developer.nxt.blackbaud-dev.com/) for the Blackbaud NXT API developer program in order to obtain your subscription key.
0. [Create a Parse application](https://parse.com) in order to create your parse app id and parse js key.

### Setup

0. Fork or clone this repository.
0. Prepare environment by:
  0. Copy `.env.sample` to `.env`
  0. Update with the necessary values
  0. Run `source .env`
0. Run `npm install`
0. Run `bower install`
0. Run `npm build`
0. Deploy this folder to your server.
