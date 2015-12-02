# Barkbaud

Blackbaud SKY API / SKY UX sample application.

## About

This sample application was built to showcase the Blackbaud SKY API and Blackbaud SKY UX. Both technologies function completely independant of one another.  

The Blackbaud SKY API currently supports the [Authorization Code Flow](https://apidocs.nxt.blackbaud-dev.com/docs/authorization/auth-code-flow/), which requires us to have a back-end server component where we're able to securely store the client secret. We've implemented the server component using NodeJS, which we automatically deploy to Heroku.

Our front-end is stored and built in the [barkbaud-ui repo](https://github.com/blackbaud/barkbaud-ui). Using Bower, we consume the built ui and move it to the ui folder during our deployment process.

## Try

We've deployed Barkbaud to heroku. Feel free to checkout the live demo of our application at [https://barkbaud.herokuapp.com](https://barkbaud.herokuapp.com).

Feel free to leave feedback by filing an [issue](https://github.com/blackbaud/barkbaud/issues).

## Run Barkbaud on your server

To run this application in your environment, you will need to complete the following steps:

### Prerequisites

0. A server, such as your local machine, capable of running [NodeJS](https://nodejs.org/).
0. A reliable internet connection for cloning the repo and installing this project's dependencies.
0. If you have not already done so, be sure to complete the <a href="https://apidocs.nxt.blackbaud-dev.com/docs/getting-started/">Getting started guide</a>.  This will guide you through the process of signing up for a Blackbaud developer account and requesting a subscription to an API product.  Once approved, your subscription will contain a **Primary key** and a **Secondary key**.  You can use either key as the subscription key value for the `bb-api-subscription-key` request header in calls to the API. You can view your subscription keys within your [profile](https://developer.nxt.blackbaud-dev.com/developer). 
0. [Register your application](https://developer.nxt.blackbaud-dev.com/comingsoon) in order to obtain the **Application ID** (client id) and **Application secret** (client secret).  If you plan on running this sample on your local machine, be sure to supply a **Redirect URI** of `https://localhost:5000/auth/callback`.
0. We assume you know how to clone a repo and use a command line interface (CLI) such as Terminal or the Windows Command Prompt.  
0. Sign up for [Parse](https://parse.com) account and create a Parse application.  You will use Parse to store the data for Dogs, DogNotes, and DogOwnerHistory while the data for constituents and notes will be stored in RE NXT and accessed via Blackbaud SKY API.
0. Grab your Parse **Application ID** and your **JavaScript Key**.  The Parse **Application ID** is the main identifier that uniquely specifies your application. This is paired with one of the keys below to provide your clients access to your application's data.  The Parse **JavaScript Key** is used access your Parse data via the Parse JavaScript SDK.  

![Parse Keys][parse-keys]
[parse-keys]: /setup/images/parsekeys.png



  -  parse app id and parse js key.

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
