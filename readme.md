# Group18

## Overview

As outlined in the review [”The diverse biological properties of the chemically inert noble gases” (Winkler et al., 2016)](https://www.ncbi.nlm.nih.gov/pubmed/26896563) there is a need to explore the possible interactions between the noble gases and proteins in order to provide viable candidates for clinical study. The drive behind the generation of this data is to provide a starting point for such exploration.

The dataset accessible on this site was created using AutoGrid4 to systematically map the energy of five noble gas ( He, Ne, Ar, Kr, Xe ) at all grid locations (in 0.375 Å steps) in all ~60,000 unique PDB structures filtered by 100% sequence similarity. This retains the highest resolution structure where multiple structures of the same proteins exist.

Before the grid calculations, the proteins were carefully prepared using an automatic script to remove water and other solvents, small molecule ligands such as drugs, metal and small inorganic ions except those important for protein function, and small molecules except cofactors etc. essential for function. Given the very large number of proteins studied, it was not practical to hand curate each protein. Where structures included small molecular effectors e.g. enzyme substrates, products, inhibitors, or receptor agonists or antagonists, the proximity of the noble gas binding to the small molecule ligand binding site is available.

The probability of productive binding relative to thermal energy is quantified by Natural information units (Nats) that are related to the Boltzmann distribution. Interactions with larger Nat values and smaller ligand distances are more likely to be interesting pharmacologically. Clearly, noble gases that bind with small energies that are comparable to thermal energies will not remain bound for long enough to affect the function of the protein.

For ease of navigation, the dataset may be searched via "Search" field at the top of the view tab. The search field looks for partial matching text entries for PDB-Ids, Protein Type and/or Description( eg. "oxygen transport") You may also search for a range of number of atoms (eg. "1000:2000") or a range of minimum binding energies (eg "-1.5:-2.0"). These searches may be combined as a single separated query (eg. "oxygen transport 1000:2000 -1.6:-2.0"). Initially only a subset of all available grid positions will be displayed determined by a maximum binding energy level set on a slider. This may be adjusted in the range from -0.3 to -2.0 kCal/Mol. You may also adjust the elements you are interested to see in the visualisation from the "Element" drop down selection. You may also filter the elements displayed by clicking the appropriate button ( He, Ne, Ar, Kr, Xe )

Note that not all PDBs have been mapped. Multiple structures of the same protein are represented by the structure with the best resolution, some proteins with unusual functions (e.g. binding to DNA or RNA) may be missing, and a very small percentage of proteins were not processed correctly by the automatic protein preparation scripts. Protein multimers were not separated into the monomeric species but mapped as the multimer.

The data is displayed using the 3D protein viewer Jolecule

Jolecule optimizes a simple but rich interface that focuses on stereochemistry. The focus is on Richardson ribbons that join with sidechains correctly. Ligands are rendered as balls-and-sticks to allow the stereochemistry to be seen clearly, as well as arrows that are used to indicate directionality on both protein and DNA chains.

Basic controls include:
ZOOM: Right-Mouse, or Shift-Left-Mouse, or Pinch-Zoom
DISTANCE LABELS: Drag from central atom
ATOM LABELS: Double click on central atom

The Project architecture is based on [plasticgui](https://github.com/boscoh/plasticgui).

## Setup

Clone the repository
run "npm install" in both the /client directory and the /server directory
create the config files based on the defaultConfig.js files found in both the /client directory and the /server directory

### client config:

```
  title: "Group18",
  isUser: true,
  debug: false,
  apiUrl: `http://localhost:3000`, //probably the only setting that needs changing for your local install
```

### server config:

```
  filesDir: path.join(__dirname, '..', 'files'),
  ip: 'localhost',
  port: 3000,
  secretKey: 'plasticgui-secret',// you will need to change this to a secret of your choosing for password hashing
  development: {
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite')
  },
  group18SearchDB_sequelize_options: { // pretty much all the database variables will need to be changed to reflect your details
    database: 'group18',
    username: 'username',
    password: 'password',
    host: 'www.odonoghuelab.org',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true,
      underscored: true,
      paranoid: true
    }
  },
  aquaria: {
    UNIPROT_FILE_PATH: 'http://aquaria.ws'
  },
  jolecule: {
    SPACIAL_CUTOFF: 2,
    MAP_FILE_PATH: 'http://hpc.csiro.au/users/272675/airliquide/mapfiles',
    MAP_SHARED_FILE_PATH: false,
    PDB_FILE_PATH: 'http://files.rcsb.org/pub/pdb/data/structures/divided/pdb',
    PREPROCESSING_SCRIPT: '/jolecule/autodock2pdbES5.js',
    JOL_STATIC_SCRIPT: '/jolecule/jol-static.js',
    NOBLE_GAS_SYMBOLS: ['He', 'Ne', 'Ar', 'Kr', 'Xe'],
    ENERGY_CUTOFF_SETS: {
      veryHigh: [-0.6, -0.6, -1.2, -1.2, -1.5],
      high: [-0.4, -0.4, -0.9, -0.9, -1.3],
      medium: [-0.3, -0.3, -0.8, -0.8, -1.2],
      low: [-0.3, -0.3, -0.6, -0.6, -0.8],
      all: [-0.3, -0.3, -0.3, -0.3, -0.3],
      dynamic20: []
    },
    MAX_ENERGY_CUTOFF: -0.5,
    MIN_ENERGY_CUTOFF: -2.0
  },
  web: {
    baseWebsite: 'http://group18.csiro.au', //you will need to change this to reflect your local domain
    baseStatic: path.join(__dirname, '..', 'files'),
    MAX_CACHE_SIZE: 500000,
    helpDocument: 'https://docs.google.com/document/d/1jLpzLvHNIwmnzuLMfgerGgbYSdKGLez2ivL3ViTULss/pub'
  }
```

## Client architecture

As per plastic-gui

First off, the client is a single-page-application architecture. This allows the client to be detached from the server, and even allows the client to talk to servers in different languages. As well, this results in easier-to-read code due to separation of concerns.

The client is written in the Vue framework, as Vue is small and works well with other Javascript libraries. As well, Vue leverages HTML and CSS directly - I really like Vue templates that mixes HTML, CSS and Javascript in one single file for a given component/web-page.

The client is setup with webpack that allows compilation to a static web-page, which can opened from the command-line. Webpack also makes it easy to transpile from ES6, leading to more readable and concise code.

As well, the web-pack configuration allows hot-reloading the client, which is great for development. In the `client` directory:

```
> npm run dev
```

You can access the client at `http://localhost:8080`. As you change the source code, the client will hot-reload! If the server is running, CORS has been enabled to allow the client at port 8080 to talk to the server at port 3000.

To get started, the first file you will work on will be `client/src/components/Home.vue`. The components in that file are from [Vue Material](https://vue-material-old.netlify.com/). This is a Google Material Design library written for Vue. From experience, using a slick and comprehensive theme such as Google Material Design will save a lot of time later on. Google Material Design has many well-designed components readily, which are web-responsive and works well with desktop and mobile.

To help things along, I've included two wrappers, `chartContainer` and `CanvasWidget`. These are convenient classes that simplify the API to `chart.js` for interactive charts, and to the HTML `canvas` element for raster graphics.

## Talking to the Server

As my focus is on data visualisation, I often work with Python codebases. That's why I need a Python server to talk to other Python libraries. However, I also love using a single language from the client and the server (hello Javascript). Why can't I do both? So I've included a choice of two functionally identical servers - `nodeserver` and `pyserver` - to talk to the client.

There are quite a few different ways of communicating to the server, the most popular seems to be Rest, and GraphQL. They each have their advantages. Here I've revived a much older approach, the Remote Procedural Call approach, following the RPC-JSON 2.0 specification.

I've found for data visualization, the data will often need to be massaged and transformed, and will unlikely be stored in a database. This makes it extremely tedious to map to a static REstful interface. Instead, the RPC approach allows the client to call Javascript functions in the server. The downside is if your data starts increasing in complexity then you'll be writing a lot of interfacing Javascript functions. However, that is far off in the future, and now you just want to be prototyping.

To do any kind of communicating, you need matching end-points on the client and the server. The infrastructure allows the `rpc` module in the client builds to call functions directly in the `handler` module in the server. There are four basic ways the client can talk to the server:

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

- admin reset password on server; resetToken field in user
- test object database table
- adminGetUsers/adminDeleteUsers in nodeserver
- email to lowercase

  ​
