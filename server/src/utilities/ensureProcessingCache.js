const joleculeHelpers = require('./joleculeHelpers.js')
const config = require('../config')
const sizeof = require('object-sizeof')
const fs = require('fs-extra')
const archiver = require('archiver')
const path = require('path')

var dataServersCaches = {}
var dataServerCacheIdToRemove

const flushCache = function (req, res) {
  let pdb = req.params.pdb
  let cacheId = pdb
  delete (dataServersCaches[cacheId])
}

const retrieveCache = function (req) {
  let pdb = req.params.pdb
  let index = req.params.index
  let cacheId = pdb
  return dataServersCaches[cacheId].dataServers
    .then(function (dataServers) {
      return dataServers[index]
    })
}

const retrieveDataServersFromCache = function (pdb) {
  let cacheId = pdb
  return dataServersCaches[cacheId].dataServers
}

const retrieveZipFile = async function (zipFile, contentsPaths) {
  let zipFilePath = path.join(contentsPaths[0], '..', zipFile + '.zip')
  let checkFileExists = s => new Promise(resolve => fs.access(s, fs.F_OK, e => resolve(!e)))
  if (await checkFileExists(zipFilePath)) {
    return zipFilePath
  }
  let zipFileOutput = fs.createWriteStream(zipFilePath)
  var archive = archiver('zip', {
    zlib: {
      level: 9
    }
  })
  archive.pipe(zipFileOutput)
  contentsPaths.forEach((contentsPath) => {
    archive.directory(contentsPath, zipFile)
  })

  archive.finalize()

  var fileZipped = new Promise((resolve, reject) => {
    zipFileOutput.on('close', function () {
      console.log(`Archive ${zipFilePath} created [${archive.pointer()} total bytes]`)
      resolve(zipFilePath)
    })
    archive.on('error', function (err) {
      reject(err)
    })
  })

  return fileZipped
}

const retrievePDBFilesFromCache = async function (pdb) {
  let cacheId = pdb
  let dataServers = dataServersCaches[cacheId]
  if (!dataServers) {
    await checkFiles(pdb)
    dataServers = dataServersCaches[cacheId]
  }
  await dataServers.dataServers
  let jol = await joleculeHelpers.set(pdb)
  let processedPdbLocalPath = jol.paths.processedPdbLocalPath
  let zipfile = `${pdb}_Grid_PDBs`
  let zipfilePath = await retrieveZipFile(zipfile, [processedPdbLocalPath])
  return zipfilePath
}

const retrieveMapFilesFromCache = async function (pdb) {
  let cacheId = pdb
  let dataServers = dataServersCaches[cacheId]
  if (!dataServers) {
    await checkFiles(pdb)
    dataServers = dataServersCaches[cacheId]
  }
  await dataServers.dataServers
  let jol = await joleculeHelpers.set(pdb)
  let paths = jol.paths
  let mapLocalPaths = paths.mapLocalPaths
  let zipfile = `${pdb}_Grid_Maps`
  let zipfilePath = await retrieveZipFile(zipfile, mapLocalPaths)
  return zipfilePath
}

const checkFiles = async function (req) {
  let pdb = req.params.pdb
  let jol = await joleculeHelpers.set(pdb)
  let cacheId = jol.pdb

  const trimCache = async function () {
    if (sizeof(dataServersCaches) > config.web.MAX_CACHE_SIZE) {
      console.log('Removing ' + dataServerCacheIdToRemove +
        ' from cache as cache [' + sizeof(dataServersCaches) +
        '] has exceeded maximum size of: ' + config.web.MAX_CACHE_SIZE)
      await removeLeastAccessedOldestFromCache()
      await trimCache()
    } else {
      console.log(sizeof(dataServersCaches) + ' of ' + config.web.MAX_CACHE_SIZE +
        ' cache used.')
    }
  }

  const removeLeastAccessedOldestFromCache = async function () {
    delete dataServersCaches[dataServerCacheIdToRemove]
    await removeLocalFiles(dataServerCacheIdToRemove)
    let oldestCacheDate = Date.now()
    let smallestAccessCount
    for (let cacheId in dataServersCaches) {
      let dataServersCache = dataServersCaches[cacheId]
      if (dataServersCache.accessCount <= smallestAccessCount || !smallestAccessCount) {
        smallestAccessCount = dataServersCache.accessCount
        if (dataServersCache.cacheDate <= oldestCacheDate) {
          dataServerCacheIdToRemove = cacheId
          oldestCacheDate = dataServersCache.cacheDate
        }
      }
    }
  }

  const removeLocalFiles = async function (cacheId) {
    let jol = await joleculeHelpers.set(cacheId)
    let pathToRemove = jol.paths.baseLocalPath
    console.log('Removing local files at ' + pathToRemove)
    fs.remove(pathToRemove)
  }

  const getDataServersFromCache = async function (jol) {
    if (dataServersCaches[cacheId]) {
      dataServersCaches[cacheId].accessCount += 1
      dataServersCaches[cacheId].accessDate = new Date()
      console.log('Retreived ' + cacheId + ' from cache.\n  Accesses: ' +
        dataServersCaches[cacheId].accessCount + ',\n  First Accessed: ' +
        dataServersCaches[cacheId].cacheDate.toString() +
        ',\n  Last Accessed: ' + dataServersCaches[cacheId].accessDate.toString()
      )
    } else {
      let cacheDate = new Date()
      if (!dataServerCacheIdToRemove) {
        dataServerCacheIdToRemove = cacheId
      }
      dataServersCaches[cacheId] = {
        'cacheDate': cacheDate,
        'accessDate': cacheDate,
        'accessCount': 1,
        'dataServers': jol.ensureJoleculeDataServers()
      }
      console.log('Assigned ' + cacheId + ' to cache.\n  Accesses: ' +
        dataServersCaches[cacheId].accessCount + ',\n  First Accessed: ' +
        dataServersCaches[cacheId].cacheDate.toString() +
        ',\n  Last Accessed: ' + dataServersCaches[cacheId].accessDate.toString()
      )
    }
    await trimCache()
    return dataServersCaches[cacheId].dataServers
  }

  if (!jol.isPdb()) {
    let err = "'" + pdb + "' is not a valid PDB record"
    console.error(err)
    throw new Error(err)
  }
  if (!jol.isEnergyCutoffSet()) {
    let err = "'" + jol.energyCutoffSet +
      "' is not a valid energyCutoffSet. (Try: " + Object.keys(jol.ENERGY_CUTOFF_SETS)
      .join(',') + ')'
    console.error(err)
    throw new Error(err.message)
  }
  try {
    await getDataServersFromCache(jol)
    return JSON.stringify({
      pdb: pdb,
      cutoff: jol.energyCutoffSet,
      dataServerRoute: jol.paths.dataServerRoute
    })
  } catch (err) {
    const message = 'An Error occured during file preparation: ' + err.message
    console.error(message)
    throw new Error(message)
  }
}

module.exports = {
  'checkFiles': checkFiles,
  'flushCache': flushCache,
  'retrieveCache': retrieveCache,
  'retrieveDataServersFromCache': retrieveDataServersFromCache,
  'retrievePDBFilesFromCache': retrievePDBFilesFromCache,
  'retrieveMapFilesFromCache': retrieveMapFilesFromCache
}
