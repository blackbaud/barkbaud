# Barkbaud

Blackbaud SKY API / SKY UX sample application.

## Contents
- [About](#about)
- [Run Barkbaud on your server](#getting-started)

<h2 id="about">About</h2>

This sample application showcases [Blackbaud SKY API](https://developer.blackbaud.com/skyapi/) and [Blackbaud SKY UX](http://developer.blackbaud.com/skyux). Both technologies function completely independent of one another. Blackbaud SKY API supports [Authorization Code Flow](https://developer.blackbaud.com/skyapi/docs/authorization/auth-code-flow), which requires us to have a back-end server component where we're able to securely store the client secret. We've implemented the server component using [NodeJS](https://nodejs.org/).  Our front end, a SKY UX SPA, is stored in the `skyux-spa-ui` folder.

### Features
- The Barkbaud application starts by requesting authorization to your Blackbaud Raiser's Edge NXT data.
- A dashboard provides a listing of dogs that are looking for a good home. Selecting a dog will take you to a page which lists the animal's owner and medical history. Biographies, owner, and medical history for each animal are stored in a [MongoDB](https://www.mongodb.com/).
- Blackbaud SKY API provides access to the constituent data. The application then uses the API to search for a constituent and retrieve the constituent ID, which is used to pair the constituent record to a dog within MongoDB.
- Medical history is stored as a subdocument for each dog in MongoDB. Upon adding medical history, the user has the option of storing the information as a note on the current owner's Raiser's Edge NXT constituent record.

### Questions or comments?
Leave feedback or ask a question by [filing an issue](https://github.com/blackbaud/barkbaud/issues).

<h2 id="getting-started">Run Barkbaud on your server</h2>

To run this application in your environment, you need a server (such as your local machine) capable of running [NodeJS](https://nodejs.org/). We're also expecting you to have some familiarity with server-side JavaScript, environment variables, cloning a repository with [Git](https://git-scm.com/downloads), and using a command line interface (CLI), such as Command Prompt within Windows or Terminal within Mac.

### Server requirements

- The latest, stable version of [NodeJS](https://nodejs.org/)
- The latest, stable version of [Git](https://git-scm.com/)
- (Optional) The latest, stable version of [Bower](http://bower.io/#install-bower)

### SKY API requirements

- **A Blackbaud Developer subscription key**
    - If you have not already done so, complete the [Getting started guide](https://developer.blackbaud.com/skyapi/docs/getting-started). This will walk you through the process of registering for a Blackbaud developer account and requesting a subscription to an API product.
    - Once approved, your subscription will contain a **primary key** and **secondary key**. When making API calls, you can use either key as the subscription key value for the `bb-api-subscription-key` request header.
    - You can view your subscription keys on your [Blackbaud Developer profile](https://developer.sky.blackbaud.com/developer).
- **A Blackbaud Developer application ID and application secret**
    - [Register your application](https://developer.blackbaud.com/apps/) in order to obtain the **application ID** (client ID) and **application secret** (client secret).
    - When you call the Blackbaud Authorization Service from your application, you pass the `redirect_uri` as part of the call. The Blackbaud Authorization Service redirects to this URI after the user grants or denies permission. Therefore, you must whitelist the web address(es) or the authorization will fail.
    - URIs must _exactly_ match the value your application uses in calls to the Blackbaud Authorization Service. If you plan on running Barkbaud on your local machine, supply a **Redirect URI** of "http://localhost:5000/auth/callback".
- Add the note type, "Barkbaud", to the Constituent API **Note Types** table.

### Steps to install and run the application

#### 1)  Clone or fork the Barkbaud repository

```
$  git clone https://github.com/blackbaud/barkbaud.git
$  cd barkbaud
```

#### 2)  Register for a free MongoDB account

- Create a [free MongoDB account](https://www.mongodb.com/cloud/atlas/signup).
- With this account, [create a new cluster](https://docs.atlas.mongodb.com/tutorial/deploy-free-tier-cluster/) named "barkbaud" (the "Sandbox" tier is free).
- [Add your connection](https://docs.atlas.mongodb.com/security/add-ip-address-to-list/) IP address to IP Acccess list.
- [Create a new database user](https://docs.atlas.mongodb.com/tutorial/create-mongodb-user-for-cluster/) (the username and password is your preference).

#### 3)  Prepare your environment

- On your server (or local machine), open the **barkbaud/** working directory and copy the configuration file **barkbaud.env-sample**, saving it as **barkbaud.env**.
- Open **barkbaud.env** in a text editor (such as Notepad or TextEdit).
- You should see a list of variables which will serve to configure Barkbaud's NodeJS environment.
- Update the file with the following values:

| Key | Description |
|---|---|
| **`AUTH_CLIENT_ID`** | Your registered application's **application ID**.<br >(See [Managing your apps](https://developer.blackbaud.com/apps/)) |
| **`AUTH_CLIENT_SECRET`** | Your registered application's **application secret**.<br>(See [Managing your apps](https://developer.blackbaud.com/apps/)) |
| **`AUTH_REDIRECT_URI`** | One of your registered application's **redirect URIs**. <br>For local development, use `http://localhost:5000/auth/callback`. <br>(See [Managing your apps](https://developer.blackbaud.com/apps/))  |
| **`AUTH_SUBSCRIPTION_KEY`** | Your Blackbaud Developer **subscription key**.<br>Use either the **primary key** or **secondary key**, visible on your [Blackbaud Developer Profile](https://developer.sky.blackbaud.com/developer). |
| **`DATABASE_URI`** | A MongoDB connection string, which points to your MongoDB database.<br>The string must follow this format: <br>`mongodb+srv://<dbuser>:<dbpassword>@<dbname>?retryWrites=true&w=majority`<br>More details about how to find your connection string can be found on [MongoDB's Documentation](https://docs.atlas.mongodb.com/tutorial/connect-to-your-cluster/). |

- Save the **barkbaud.env** file.
- Review the **.gitignore** file.  The purpose of this file is to specify which directories and files Git should ignore when performing a commit. Note that the **barkbaud.env** file is ignored. This prevents the file from being synced to your repository and protects your registered application's keys and other sensitive data from being exposed.

#### 4)  Install dependencies and run the application

Using Terminal/Command Prompt, change to the working directory (`cd barkbaud`) and type:

```
barkbaud $  npm install
barkbaud $  npm run setup
```

- The first command installs all of Barkbaud's dependencies. It may take a few minutes to complete.
- The second command builds and configures the database, so it **should be executed only once**.

Now run the prebuild step:

```
barkbaud $  npm run prebuild
```

- This command installs all of the UI dependencies for the SKY UX SPA. It may take a few minutes to complete.

Build the UI application by running:

```
barkbaud $  npm run build
```

- This builds the UI to the `barkbaud\skyux-spa-ui\dist\skyux-spa-ui` location on disk.
- Node.js will reference this build location to use as the UI when running the app.  It is not necessary to serve the Angular SPA application separately.

Now that all the dependencies have been installed, the database created, and the UI SPA has been built, we can now run the application with:

```
barkbaud $  npm start
```

Open a Web browser to <a href="http://localhost:5000">http://localhost:5000</a>.

### Notes for deploying  

To simplify the demo for local development, this tutorial is written to run the application over HTTP.  When deploying to production, the application should be configured to run over HTTPS with the appropriate SSL (Secure Sockets Layer) certificate.
