# Barkbaud

Blackbaud SKY API / SKY UX sample application.

## About

This sample application was built to showcase the Blackbaud SKY API and Blackbaud SKY UX. Both technologies function completely independant of one another.  The Blackbaud SKY API currently supports the [Authorization Code Flow](https://apidocs.nxt.blackbaud-dev.com/docs/authorization/auth-code-flow/), which requires us to have a back-end server component where we're able to securely store the client secret. We've implemented the server component using NodeJS.  Our front-end is stored and built in the [barkbaud-ui repo](https://github.com/blackbaud/barkbaud-ui). Using Bower, we consume the built ui and move it to the barkbaud repo's **ui** folder during our deployment process.

The Barkbaud application starts by requesting authorization to your Blackbaud NXT data. A dashboard provides a listing of dogs that are looking for a good home. The biographies of each animal are stored in Parse within a class (table) named **Dog**.  Selecting a dog will take you to a page which lists the animal's owner and medical history. Blackbaud SKY API provides access to constituent data. The application uses the api to search for an constituent and retreive the constituent id which is used to relate the constituent to a dog as a dog owner within Parse. Owner history is stored within a Parse class named **DogOwnerHistory**. Medical history is stored as notes within a Parse class named **DogNotes**. Upon adding medical history, the user has the option of storing the information as a note on the current owner's RE NXT record. 

## Try

We've deployed Barkbaud to heroku. Feel free to checkout the live demo of our application at [https://barkbaud.herokuapp.com](https://barkbaud.herokuapp.com).

Feel free to leave feedback by filing an [issue](https://github.com/blackbaud/barkbaud/issues).

## Run Barkbaud on your server

To run this application in your environment, you will need to complete the following steps:

## Prerequisites

-  A server, such as your local machine, capable of running [NodeJS](https://nodejs.org/).
-  A reliable internet connection for cloning the repo and installing this project's dependencies.
-  If you have not already done so, be sure to complete the <a href="https://apidocs.nxt.blackbaud-dev.com/docs/getting-started/">Getting started guide</a>.  This will guide you through the process of signing up for a Blackbaud developer account and requesting a subscription to an API product.  Once approved, your subscription will contain a **Primary key** and a **Secondary key**.  You can use either key as the subscription key value for the `bb-api-subscription-key` request header in calls to the API. You can view your subscription keys within your [profile](https://developer.nxt.blackbaud-dev.com/developer). 
-  [Register your application](https://developer.nxt.blackbaud-dev.com/comingsoon) in order to obtain the **Application ID** (client id) and **Application secret** (client secret).  If you plan on running this sample on your local machine, be sure to supply a **Redirect URI** of `https://localhost:5000/auth/callback`.
-  We assume you know how to clone a repo and use a command line interface (CLI) such as Terminal or the Windows Command Prompt.  

## Setup Parse
0. Sign up for a [Parse](https://parse.com) account and create a Parse application.  You will use Parse to store the data for Dogs, DogNotes, and DogOwnerHistory while the data for constituents and notes will be stored in RE NXT and accessed via Blackbaud SKY API.
0.  Copy and store your Parse **Application ID** and your **JavaScript Key**. 

![Parse Keys][parse-keys]
[parse-keys]: /setup/images/parsekeys.png

## Import Dog data and images

Let's populate Parse with the data necessary to power the app.  Parse allows you to import json files as data classes.  The json files can be found within this repo's **setup/data** folder.  After we import the data, we will upload the dog images to the appropriate class within Parse.  The image files can be found within this repo's **setup/images** folder. 

### Import json files as Parse data classes

- Login to Parse.  Click the **Core** menu item followed by the **Data** tab on the left hand side of the app.  
- Locate the json files on your file system.  These files can be found within the barkbaud repo's **setup/data** folder.
- Click the **Import** button located under the **Data** tab.

![Import Class][import-class]
[import-class]: /setup/images/importclass.png

- Drag the **Dog.json** file to the **Import Data** screen.  Accept the defaults for **Collection Type** and **Collection Name**. Click the **Finish Import** button.

![Import Data][import-data]
[import-data]: /setup/images/importdata.png

- Repeat the process to import the data from the **DogNotes.json** and **DowOwnerHistory.json** files.


### Upload dog images

With the json data imported, its time to add a new column to the **Dog** class (table).  This column will hold the images for each dog.

- Click the **Core** menu item followed by the **Data** tab on the left hand side of the app.  
- Click the **Dog** class under the **Data** tab. 
- Select the **+ Col** button.  The **Add a Column** dialog window will be displayed.
- For the **Select a type* drop down, select **File** as the column type.
- Enter **image** as the column name. 
- Click the **Create Column** button. 

![Add column][add-col]
[add-col]: /setup/images/addcol.png

With the new **image** column added to the **Dog** class, let's upload an image for each dog.

- Select the first row in the class and note the name of the dog. 
- Double-click **(undefined)** value within the row's **image** column to change the value to **Upload File**.  Double click again to open the file dialog window.  
- Select the image file for the appropriate dog.  
- Repeat the process for the remaining dogs.


## Clone repo and prep environment
0. Fork or clone this repository.
0. Copy the environment file named **.env.sample** as **.env**.
0. Provide environment variable values by updating the **.env** file with the following values:
    * `AUTH_CLIENT_ID` = Your registered application's **Application ID**.  See [Managing your apps](https://apidocs.nxt.blackbaud-dev.com/docs/apps/).
    * `AUTH_CLIENT_SECRET` = Your registered application's **Application secret**.
    * `AUTH_SUBSCRIPTION_KEY` = Provide your **Subscription key**.  Use either the **primary key** or **secondary key**.  See your [profile](https://developer.nxt.blackbaud-dev.com/developer).
    * `AUTH_REDIRECT_URI` = One of your registered application's **Redirect URIs**. As you try out this sample locally, use `https://localhost:5000/auth/callback`.  See [Managing your apps](https://apidocs.nxt.blackbaud-dev.com/docs/apps/).
    * `PARSE_APP_ID` = Parse **Application ID** 
    * `PARSE_JS_KEY` = Parse **JavaScript Key**
    
0. Review the **.gitignore** file which specifies untracked files to ignore within git.  Note how the **.env** file is ignored. This prevents your registered application's keys from being exposed to everyone else on GitHub. 

## Install dependencies and run the application   
 
0. Using Terminal/Command Prompt, change to the working directory: `cd barkbaud`
0. Run `npm install`.  **npm** is the package manager for **nodejs**.  `npm install` installs all modules that are listed within the **package.json** file and their dependencies into the local **node_modules** directory. 
0. Optional.  Run `bower install`.  **bower** helps manage UI dependencies. Our front-end is stored and built in the [barkbaud-ui repo](https://github.com/blackbaud/barkbaud-ui). Using `bower install`, we pull down the ui components from the barkbaud-ui repo into this project's **bower_components** folder.
0. Optional.  Run `npm build`.  This copies the ui build components from the **bower_components** folder to the **ui** folder. 
0. Run `source .env` to load the environment variables from the **.env** file into your node app. 
0. Run node index.js to start the application.  
0. Open your browser to [https://localhost:5000](https://localhost:5000).
  
<pre><code>$ cd barkbaud
barkbaud $ npm install
barkbaud $ bower install
barkbaud $ npm build
barkbaud $ source .env 
barkbaud $ node index.js

==>  Now browse to https://localhost:5000/
</code></pre>

