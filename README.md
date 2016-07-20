# Barkbaud

Blackbaud SKY API / SKY UX sample application.

## Contents
- [About](#about)
- [Run Barkbaud on your server](#getting-started)
- [Deploy to Heroku](#deploy)

<h2 id="about">About</h2>
This sample application showcases the [Blackbaud SKY API](https://developer.sky.blackbaud.com/) and [Blackbaud SKY UX](http://skyux.developer.blackbaud.com/). Both technologies function completely independent of one another.  The Blackbaud SKY API currently supports the [Authorization Code Flow](http://apidocs.sky.blackbaud.com/docs/authorization/auth-code-flow/), which requires us to have a back-end server component where we're able to securely store the client secret. We've implemented the server component using [NodeJS](https://nodejs.org/).  Our front-end is stored and built in the [barkbaud-ui repository](https://github.com/blackbaud/barkbaud-ui). Using [Bower](http://bower.io/), we consume the front-end components and move it to the Barkbaud application's **ui/** folder during the install and build steps.

### Features:
- The Barkbaud application starts by requesting authorization to your Blackbaud Raiser's Edge NXT data.
- A dashboard provides a listing of dogs that are looking for a good home. Selecting a dog will take you to a page which lists the animal's owner and medical history. Biographies, owner and medical history for each animal are stored in a MongoDB database at [mLab](https://www.mlab.com).
- Blackbaud SKY API provides access to the constituent data. The application then uses the API to search for a constituent and retrieve the constituent ID which is used to pair the constituent record to a dog within mLab.
- Medical history is stored as a subdocument for each dog in mLab. Upon adding medical history, the user has the option of storing the information as a note on the current owner's Raiser's Edge NXT constituent record.

### View the [live demo](https://barkbaud.herokuapp.com)
We've deployed Barkbaud to Heroku. Feel free to checkout the live demo of our application at [https://barkbaud.herokuapp.com](https://barkbaud.herokuapp.com).

### Questions? Comments?
Leave feedback or ask a question by [filing an issue](https://github.com/blackbaud/barkbaud/issues).

<h2 id="getting-started">Run Barkbaud on your server</h2>

To run this application in your environment, you will need a server (such as your local machine) capable of running [NodeJS](https://nodejs.org/). We're also expecting you to have some familiarity with server-side JavaScript, environment variables, cloning a repository with [Git](https://git-scm.com/downloads), and using a command line interface (CLI), such as Command Prompt within Windows, or Terminal within Mac.

### Server Requirements:

- The latest, stable version of [NodeJS](https://nodejs.org/)
- The latest, stable version of [Git](https://git-scm.com/)
- (Optional) The latest, stable version of [Bower](http://bower.io/#install-bower)

### Sky API Requirements:

- **A Blackbaud Developer Subscription Key**
    - If you have not already done so, be sure to complete the [Getting started guide](https://apidocs.sky.blackbaud.com/docs/getting-started/). This will guide you through the process of registering for a Blackbaud developer account and requesting a subscription to an API product.
    - Once approved, your subscription will contain a **Primary Key** and a **Secondary Key**.  You can use either key as the subscription key value for the `bb-api-subscription-key` request header when making calls to the API.
    - You can view your subscription keys on your [Blackbaud Developer Profile](https://developer.sky.blackbaud.com/developer).
- **A Blackbaud Developer Application ID and Application Secret**
    - [Register your application](https://developerapp.sky.blackbaud.com/applications) in order to obtain the **Application ID** (client ID) and **Application Secret** (client secret).
    - When you call the Blackbaud Authorization Service from your application, you pass the `redirect_uri` as part of the call. The Blackbaud Authorization Service redirects to this URI after the user grants or denies permission. Therefore, you must whitelist the web address(es) or the authorization will fail.
    - URIs must _exactly_ match the value your application uses in calls to the Blackbaud Authorization Service. If you plan on running Barkbaud on your local machine, be sure to supply a **Redirect URI** of "http://localhost:5000/auth/callback".
- Add the note type, "Barkbaud", to the Constituent API **Note Types** table.

### Steps to Install:

#### 1)  Clone or fork the Barkbaud repository

```
$  git clone https://github.com/blackbaud/barkbaud.git
$  cd barkbaud
```

#### 2)  Register for a free mLab account

- Create a [free mLab account](https://mlab.com/signup/) (formally known as "MongoLab").
- Once logged into mLab, [create a new database subscription](http://docs.mlab.com/#create-sub) (the "Sandbox" tier is free).
- Within this subscription, create a new database named "barkbaud".
- Open the database and click "Users > Add database user" to create a database user (the username and password is your preference).

#### 3)  Prepare your environment

- On your server (or local machine), open the **barkbaud/** working directory and copy the configuration file **barkbaud.env-sample**, saving it as **barkbaud.env**.
- Open **barkbaud.env** in a text editor (such as Notepad or TextEdit).
- You should see a list of variables which will serve to configure Barkbaud's NodeJS environment.
- Update the file with the following values:<br><br>
    <table>
    <tr>
        <td>**`AUTH_CLIENT_ID`**</td>
        <td>
            Your registered application's **Application ID**.<br>
            (See, [Managing your apps](https://apidocs.sky.blackbaud.com/docs/apps/).)
        </td>
    </tr>
    <tr>
        <td>**`AUTH_CLIENT_SECRET`**</td>
        <td>
            Your registered application's **Application Secret**.<br>
            (See, [Managing your apps](https://apidocs.sky.blackbaud.com/docs/apps/).)
        </td>
    </tr>
    <tr>
        <td>**`AUTH_REDIRECT_URI`**</td>
        <td>
            One of your registered application's **Redirect URIs**. <br>
            For local development, use `http://localhost:5000/auth/callback`. <br>
            (See, [Managing your apps](https://apidocs.sky.blackbaud.com/docs/apps/).)
        </td>
    </tr>
    <tr>
        <td>**`AUTH_SUBSCRIPTION_KEY`**</td>
        <td>
            Your Blackbaud Developer **Subscription Key**.<br>
            Use either the **Primary key** or **Secondary key**, visible on your [Blackbaud Developer Profile](https://developer.sky.blackbaud.com/developer).
        </td>
    </tr>
    <tr>
        <td>**`DATABASE_URI`**</td>
        <td>
            A MongoDB connection string, which points to your mLab database. The string must follow this format: <br>
            ```
            mongodb://<dbuser>:<dbpassword>@<dbaddress>/<dbname>
            ```
            <br>
            More details about how to find your connection string can be found on [mLab's Documentation](http://docs.mlab.com/connecting/#connect-string).
        </td>
    </tr>
    </table>
- Save the **barkbaud.env** file.
- Review the **.gitignore** file.  The purpose of this file is to specify which directories and files Git should ignore when performing a commit. Note that the **barkbaud.env** file is ignored. This prevents the file from being synced to your repository and protects your registered application's keys and other sensitive data from being exposed.

#### 4)  Install dependencies and run the application

Using Terminal/Command Prompt, change to the working directory (`cd barkbaud`) and type:

```
barkbaud $  npm install
barkbaud $  npm run setup
```

- The first command installs all of Barkbaud's dependencies. It may take a few minutes to complete.
- The second command builds and configures the database, so it should be executed only once.
- (Optional) Run `bower install`.
    - Our front-end is stored and built in the [barkbaud-ui repository](https://github.com/blackbaud/barkbaud-ui).
    - Using Bower, we pull down the front-end components from Barkbaud UI into this project's **bower_components/** folder.
- (Optional) Run `npm build`.
    - This copies the front-end build components from the **bower_components/barkbaud-ui/** directory into our application's **ui/** folder.

Now that all the dependencies have been installed and the database created, we can run the application with:

```
barkbaud $  npm start
```

Open a Web browser to <a href="http://localhost:5000">http://localhost:5000</a>.

<h2 id="deploy">Deploy Barkbaud to Heroku</h2>

- Create a [free Heroku account](https://signup.heroku.com/login).
- From your Heroku Dashboard, [create a new Heroku application](https://dashboard.heroku.com/new).
- Edit your [Blackbaud Sky API Application](https://developerapp.sky.blackbaud.com/applications) and add a new **Redirect URL** that points to your Heroku application's URL. This URL should also include the path "/auth/callback". For example:
```
https://your-heroku-app-name.herokuapp.com/auth/callback
```
- Open **barkbaud.env** and change the variable **`AUTH_REDIRECT_URI`** to reference this new URL.
- Install the [Heroku Toolbelt](https://toolbelt.heroku.com/) on your local machine. It's a command line interface (CLI) built specifically for Heroku applications.
- Open Terminal/Command Prompt and login to Heroku via the Toolbelt:

```
$  heroku login
```

- Change your working directory to **barkbaud/** (`cd barkbaud`) and type `git status` to make sure Git is working properly.
- Add a Git remote that references your Heroku application's Git repository:

```
barkbaud $  heroku git:remote -a your-app-name
```

- Finally, in the **barkbaud/** working directory, type:

```
barkbaud $  npm run setup --heroku
barkbaud $  git add .
barkbaud $  git commit -m "Made it better."
barkbaud $  git push heroku master
barkbaud $  heroku open
```
Visit your Heroku application's URL to view a public version of your Barkbaud application!
