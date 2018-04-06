
# plasticgui

Plasticgui is a template GUI for prototyping data-visualisations using RPC protocols

Out of the box, it includes:

- Vue framework with Google Material design
- Webpack hot-reloading for client development
- easily switch from static web-page to client/server 
- choice of server in Node.js or Python 2/3
- robust rpc talk between client and server
- basic user system with secure passwords
- simple SQLite database by default

## Quick start

First, download the [package](https://github.com/boscoh/plasticgui/archive/master.zip)

1. To quickly run PlasticGui in the client/Nodejs-server combo, in the  `nodeserver` directory, install the dependencies:

   ```
   > npm install
   ```

   Then in the `plasticgui` directory:

   ```
   > node gui.js
   ```

2. Alternatively, for the Python server version, in the `pyserver` directory, install

   ```
   > pip install -r requirements.txt
   ```

   Then in the `plasticgui` directory:

   ```
   > python gui.py
   ```

This will open the template client that can talk to a local server: fetching text, register/login users, download/upload files.

## Why?

I make a lot of data visualization webapps. Sometimes it's just a static webapp, with which I can just zip and send to users. Other times, I want to emulate a desktop app with a local client/server architecture, perhaps interfacing with some modeling code. I might even decide serve it on a regular website.

I wrote this webapp template to provide the minimum architecture required to seamlessly cycle through these kinds of situation. There is very little setup, yet more powerful pieces can be easily swapped out should the need arise.

## Client architecture

First off, the client is a single-page-application architecture. This allows the client to be detached from the server, and even allows the client to talk to servers in different languages. As well, this results in easier-to-read code due to separation of concerns.

The client is written in the Vue framework, as Vue is small and works well with other Javascript libraries. As well, Vue leverages HTML and CSS directly -  I really like Vue templates that mixes HTML, CSS and Javascript in one single file for a given component/web-page. 

The client is setup with webpack that allows compilation to a static web-page, which can opened from the command-line. Webpack also makes it easy to transpile from ES6, leading to more readable and concise code.

As well, the web-pack configuration allows hot-reloading the client, which is great for development. In the `client` directory:

```
> npm run dev
```

You can access the client at `http://localhost:8080`. As you change the source code, the client will hot-reload! If the server is running, CORS has been enabled to allow the client at port 8080 to talk to the server at port 3000.

To get started, the first file you will work on will be `client/src/components/Home.vue`. The components in that file are from [Vue Material](https://vue-material-old.netlify.com/). This is a Google Material Design library written for Vue. From experience, using a slick and comprehensive theme such as Google Material Design will save a lot of time later on. Google Material Design has many well-designed components readily, which are  web-responsive and works well with desktop and mobile.

To help things along, I've included two wrappers, `chartContainer` and `CanvasWrapper`. These are convenient classes that simplify the API to `chart.js` for interactive charts, and to the HTML `canvas` element for raster graphics.

## Talking to the Server

As my focus is on data visualisation, I often work with Python codebases. That's why I need a Python server to talk to other Python libraries. However, I also love using a single language from the client and the server (hello Javascript). Why can't I do both? So I've included a choice of two functionally identical servers - `nodeserver` and `pyserver` - to talk to the client.

There are quite a few different ways of communicating to the server, the most popular seems to be Rest, and GraphQL. They each have their advantages. Here I've revived a much older approach, the Remote Procedural Call approach, following the RPC-JSON 2.0 specification.

I've found for data visualization, the data will often need to be massaged and transformed, and will unlikely be stored in a database. This makes it extremely tedious to map to a static REstful interface. Instead, the RPC approach allows the client to call Javascript functions in the server. The downside is if your data starts increasing in complexity then you'll be writing a lot of interfacing Javascript functions. However, that is far off in the future, and now you just want to be prototyping.

To do any kind of communicating, you need matching end-points on the client and the server. The infrastructure allows the  `rpc` module in the client builds to call functions directly in the  `handler` module in the server. There are four basic ways the client can talk to the server:

- basic functions
- file upload functions
- file download functions
- direct access to files on the server

## Storing Users and Other Data

If your webapp starts getting traction, you'll probably have to implement a user system. There's a lot of things to get right just to get a basic user system up and running, such as sessions, database storage and encryption. So a user system is implemented out of the box.

In the node server, passport manages user sessions, and sequelize is used to manage the database. In the python server, flask-login manages sessions, and sqlalchemy manages the database.

In the client, passwords are hashed and persistent session information is saved in LocalStorage, which is used to retry login on client initialisation. In the database, passwords are salted.

In the client, a register, login and edit-user page is included. The user system can be turned off in the `config.js` file.

### Other Server concerns

Database is accessed through ORM, and uses only generic fields. An SQLite database is used as it is trivial to setup. Since an ORM is used, it is easy to swap it out for a more powerful database if the need arises.

In Python, the `flask` framework is used. In Node, it's `express`.

TODO: How to add other fields?

TODO: How to access data?

different ways of accessing the client

how to deploy the server, autoreloading for development

deployment

## TODO 

* admin reset password on server; resetToken field in user
* test object database table
* adminGetUsers/adminDeleteUsers in nodeserver
* switch to vuetify
* email to lowercase

  ​
