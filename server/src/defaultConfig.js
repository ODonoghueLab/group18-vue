const path = require('path')

module.exports = {
  filesDir: path.join(__dirname, '..', 'files'),
  ip: 'localhost',
  port: 3000,
  secretKey: 'plasticgui-secret',
  development: {
    filesDir: path.join(__dirname, '..', 'files'),
    ip: 'localhost',
    port: 3000,
    db: {
      host: 'localhost',
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', 'database.sqlite')
    },
    client: {
      host: 'http://localhost:8080'
    },
    email: {
      transport: {
        host: 'yourHost', // need to change these settings for your SMTP settings
        port: 25
      },
      resetEmail: 'yourEmail@yourCompany.com' // need to change these settings for your email settings
    }
  },
  group18SearchDB_sequelize_options: {
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
    baseWebsite: 'http://group18.csiro.au',
    baseStatic: path.join(__dirname, '..', 'files'),
    MAX_CACHE_SIZE: 500000,
    helpDocument: 'https://docs.google.com/document/d/1jLpzLvHNIwmnzuLMfgerGgbYSdKGLez2ivL3ViTULss/pub'
  }
}
