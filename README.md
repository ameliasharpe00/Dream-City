# CIS450FinalProject - Dream City

Welcome to Dream City. This is a web application that allows users to find cities in the US based on their preferences such as housing budget, tolerance to air quality, and cuisine preference. 

__/server__: this folder holds the server application files, tests and dependencies (as required by Node.js)
* .gitignore: a gitignore file for the Node application
* config.json: holds the RDS connection credentials/information and application configuration
settings (like port and host)
* package.json: maintains the project dependency tree; defines project properties, scripts, etc
* package-lock.json: aves the exact version of each package in the application dependency
tree for installs and maintenance.
* routes.js: This is where the code for the API routes’ handler functions go.
* server.js: The code for the routed HTTP application. You will see that it imports routes.js
and maps each route function to an API route and type (like GET, POST, etc).

/server/tests: This folder contains the test files for the API:
* results.json: Stores expected results for the tests in a json encoding.
* tests.js: Stores the tests

__/client__
* .gitignore: A gitignore file for the client application.
* package.json: maintains the project dependency tree; defines project properties, scripts,
etc
* package-lock.json: saves the exact version of each package in the application dependency
tree for installs and maintenance

* /public
This folder contains static files like index.html file and assets like robots.txt for specifying web
page titles, crawlability, et cetera 

* /src
This folder contains the main source code for the React application. Specifically:
* config.json: Holds server connection information (like port and host). Could be replaced by
a .env file, but students find this easier to manage
* fetcher.js: Contains helper functions that wrap calls to API routes. improved testability,
reusability, and usability
* index.js: This the main JavaScript entry point to the application and stores the main DOM
render call in React. For this application, page routing via components and imports for
stylesheets are also embedded in this file.

* /pages: This folder contains files for React components corresponding to the three pages in
the application (see the sections below for more details). These are:
    * Home Page: this is the landing page and shows the user a description of our website
    * Filter Page (Get The Best Match!): on this page, a user can choose how they want to filter out cities based on different criteria. There is a dropdown menu that has 5 filtering options the user can choose; after choosing one, you must hit the Search bar.
    * City Rankings Page: here, the user is able to choose 1 of 5 ways to rank cities and display results by hitting the "Search" button. For example, the user can pick "Most vegan/vegetarian restaurants", which will show a column of cities in the order of decreasing availability of vegan/vegetarian restaurants
    * News Page: the user can read news about any city of interest by typing in the name of the city in the text box
    * Maps Page: the user can enter the (city, state) of interest and view its location on a map

* /components Similar to the /pages folder, but this folder contains files for React
components corresponding to smaller, reusable components, especially those used by
pages

__/data_preprocessing_code__: contains the Jupyter notebook (.ipynb) that was used to wrangle the data

__/unprocessed_datasets__: contains all the datasets as downloaded from the sources

__/processed_data_new__: contains all the cleaned and wrangled datasets

__HOW TO GET LAUNCH THE WEB APP:__
1. cd into the server folder and run "npm install"
2. While in server:
    I) run "npm install newsapi --save" and "npm install bingmaps-react" to ensure that the News API and Bing Maps API work.
    II) run "npm start"
3. cd into the client folder, run "npm install" followed by "npm start"

This will start the website on port 3000 and the server on port 8080

__*** IMPORTANT ***__: Please ensure to start the server or else the webpage will display errors


# Dream-City
# Dream-City
