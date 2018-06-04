const joleculeHelpers = require('./joleculeHelpers.js')
const config = require('../config')
const sizeof = require('object-sizeof')
const fs = require('fs-extra')

var dataServersCaches = {}
var dataServerCacheIdToRemove

const flushCache = function(req, res) {
  let pdb = req.params.pdb
  let energyCutoffSet = req.params.energyCutoffSet
  let cacheId = pdb + '_' + energyCutoffSet
  delete(dataServersCaches[cacheId])
  res.redirect('/' + pdb + '?cutoff=' + energyCutoffSet)
}

const retrieveCache = function(req) {
  let pdb = req.params.pdb
  let energyCutoffSet = req.params.energyCutoffSet
  let index = req.params.index
  let cacheId = pdb + '_' + energyCutoffSet
  return dataServersCaches[cacheId].dataServers
    .then(function(dataServers) {
      return dataServers[index]
    })
}

const retrieveDataServersFromCache = function(pdb, energyCutoffSet) {
  let cacheId = pdb + '_' + energyCutoffSet
  return dataServersCaches[cacheId].dataServers
}

const retrievePDBFilesFromCache = async function(req) {
  let pdb = req.params.pdb
  let energyCutoffSet = req.params.energyCutoffSet
  let cacheId = pdb + '_' + energyCutoffSet
  let dataServers = dataServersCaches[cacheId]
  if (!dataServers) {
    await checkFiles(req)
    dataServers = dataServersCaches[cacheId]
  }
  await dataServers.dataServers
  let jol = await joleculeHelpers.set(pdb, energyCutoffSet)
  let paths = jol.paths
  return paths.processedPdbLocalPath
}

const retrieveMapFilesFromCache = async function(req) {
  let pdb = req.params.pdb
  let energyCutoffSet = req.params.energyCutoffSet
  let cacheId = pdb + '_' + energyCutoffSet
  let dataServers = dataServersCaches[cacheId]
  if (!dataServers) {
    await checkFiles(req)
    dataServers = dataServersCaches[cacheId]
  }
  await dataServers.dataServers
  let jol = await joleculeHelpers.set(pdb, energyCutoffSet)
  let paths = jol.paths
  return paths.mapLocalPaths
}

const checkFiles = async function(req) {
  let pdb = req.params.pdb
  let energyCutoffSet = req.params.energyCutoffSet
  let jol = await joleculeHelpers.set(pdb, energyCutoffSet)
  let cacheId = jol.pdb + '_' + jol.energyCutoffSet

  const trimCache = async function() {
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

  const removeLeastAccessedOldestFromCache = async function() {
    delete dataServersCaches[dataServerCacheIdToRemove]
    await removeLocalFiles(dataServerCacheIdToRemove)
    let oldestCacheDate = Date.now()
    let smallestAccessCount
    for (let cacheId in dataServersCaches) {
      let dataServersCache = dataServersCaches[cacheId]
      if (dataServersCache.accessCount <= smallestAccessCount || !
        smallestAccessCount) {
        smallestAccessCount = dataServersCache.accessCount
        if (dataServersCache.cacheDate <= oldestCacheDate) {
          dataServerCacheIdToRemove = cacheId
          oldestCacheDate = dataServersCache.cacheDate
        }
      }
    }
  }

  const removeLocalFiles = async function(cacheId) {
    let args = cacheId.split('_')
    if (args.length !== 2) {
      throw new Error(
        'Error removing local files, could not read arguments from ' +
        cacheId)
    }
    let jol = await joleculeHelpers.set(args[0], args[1])
    let pathToRemove = jol.paths.baseLocalPath
    console.log('Removing local files at ' + pathToRemove)
    fs.remove(pathToRemove)
  }

  const getDataServersFromCache = async function(jol) {
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
  await jol
  if (!jol.isPdb()) {
    let err = "'" + pdb + "' is not a valid PDB record"
    console.error(err)
    throw new Error(err)
  }
  if (!jol.isEnergyCutoffSet()) {
    let err = "'" + energyCutoffSet +
      "' is not a valid energyCutoffSet. (Try: " + Object.keys(jol.ENERGY_CUTOFF_SETS)
      .join(',') + ')'
    console.error(err)
    throw new Error(err.message)
  }
  try {
    await getDataServersFromCache(jol)
    return JSON.stringify({
      pdb: pdb,
      cutoff: energyCutoffSet,
      dataServerRoute: jol.paths.dataServerRoute
    })
  } catch (err) {
    const message = 'An Error occured during file preparation: ' + err.message
    console.error(message)
    throw new Error(message)
  }
}

const checkFilesAndReturnJSON = async function(req, res) {
  try {
    const result = await checkFiles(req)
    res.setHeader('Content-Type', 'application/json')
    res.send(result)
  } catch (err) {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({
      ErrorText: err.message
    }))
  }
}

module.exports = {
  'checkFiles': checkFiles,
  'checkFilesAndReturnJSON': checkFilesAndReturnJSON,
  'flushCache': flushCache,
  'retrieveCache': retrieveCache,
  "retrieveDataServersFromCache": retrieveDataServersFromCache,
  'retrievePDBFilesFromCache': retrievePDBFilesFromCache,
  'retrieveMapFilesFromCache': retrieveMapFilesFromCache
}