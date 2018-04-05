
# PLASTICGUI

PlasticGui is a template for easy prototyping of webapps. It's plastic!

It can be run both as a static web-page, or as a client/server combo.

Lots of useful things out of the box includes:

- Single-Page-Application in Vue
- Google Material design
- hot reloading of client in webpack
- clean rpc talk between client and server
- user system
- simple SQLite database (can be easily switched out)
- Node.js or Python 2/3 server

## Install

This is a Javascript SPA, which is compiled to a static web-page that can be opened anywhere, including from your local file-system.

The app needs to be compiled in the [`node.js`](https://nodejs.org/en/) ecosystem, using either the default [ `npm` ](https://www.npmjs.com/) package-manager, or the better [ `yarn` ](https://yarnpkg.com/) package manager.

Once `yarn` is installed, in the app directory, run:

```bash
> yarn install
```

Then build the client:

```bash
> yarn build
```

The app can now be opened from `dist/index.html` in your browser.

## Why?

I make a lot of data visualization webapps. Sometimes it's just a static webapp, which I can zip up and send to clients. Other times, I want to emulate a desktop app with a local client/server architecture. Later, I might even serve it on a remote website.

I developed this architecture to pleasantly cycle between these three phases, with very little setup (e.g. SQLite versus Postgres). But pieces can be easily swapped, should the need arise, for more powerful modules.

## Development

If you are ready to make changes to the source code in the `src` directory, you can run a development version of the app:

```bash
> ./hot_reload.sh
```

This will open up the page in the browser at the url `localhost:8080`. Any changes in the `src` directory will cause the app to be recompiled and automatically reloaded in the browser.

## Webapp UX Design

Easier to write than server-side rendering. 

Separation of concern. Allows good UX experience.

Data both in/out through AJAX.

Can run client webapp completely independently, with server as an optional extra.

Lightweight. Javascript focused - client and server in same language.

Vue component templates - integrated javascript, css and HTML in the same page.

- vue-material
- client-side SPA - with ajax for all optional data - rpc-json-api
- frameworks make life a lot easier
- choose vue as it’s based on javascript
- vue - componenent model that combines HTML/CSS/Javascript provides the right level of encapsulation
- material design - google’s framework provides a modern, web-responsive well thought out framework for UX
- Web-response/mobile-ready, using Google Material Design

## Rpc-json api

Want to separate client from server -> SPA approach.
Allows webclient development independent of server. Can you use
Node.js or Python. Webclient tolerant of server failures.

Data transfer is clear, JSON api, not server-side rendering.

Much less boiler-plate in communication than writing handlers for RESTful
interfaces. Not designed for exposing API as a data-flow, best as a server to
a rich UX webapp.

Result is a thin wrapper around a very simple database representation,
where the focus is on computation.

Thus, the handlers in the server are Javascript functions that take in JSON literals
and return JSON literals as a promise.

There are four basic modes to trigger the handlers:

- basic functions
- uploading functions
- donwloading functions
- file access to a special directory on the server

## Servers and Database

- Express in Node using passport and sequelize
- Flask in Python using flask-login and SqlAlchemy and Twisted
- Python 2 and 3

- dataase - manager user, json-store
- use sqlite -> configuration free, get started quickly
- uses only generic type fields so can swap out easily
	- Sequelize in Node.js
	- Sqlalchemy in Python
- User table out of the box
- Generic Object with Attr out of the box
* passport in node
* flask-sessions in python
* sha224 for passwords in localstorage, and in api calls
* salted in database
* basic user model - sha password in client, salt password for db

## TODO 

* admin reset password on server; resetToken field in user
* test object database table
* adminGetUsers/adminDeleteUsers in nodeserver
* switch to vuetify
* email to lowercase
* create config.js/config.py on run scripts @done
* run flask properly using python3 @done
