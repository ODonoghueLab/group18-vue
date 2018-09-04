const models = require('../models')

module.exports = {
  set: async function (pdb, energyCutoffSet) {
    return joleculeHelpers(pdb, energyCutoffSet)
  }
}

var joleculeHelpers = async function (pdb, energyCutoffSet = 'all') {
  const config = require('../config')
  const ensureFile = require('./ensureFile.js')
  const fs = require('fs-extra')
  const numeral = require('numeral')
  const path = require('path')

  const runScriptAsync = ensureFile.runScriptAsync
  const ensureFileWithRemoteFile = ensureFile.ensureFileWithRemoteFile
  const decompressGzFile = ensureFile.decompressGzFile
  const checkIfFile = ensureFile.checkIfFile

  const exports = {}

  const SPACIAL_CUTOFF = config.jolecule.SPACIAL_CUTOFF
  const MAP_FILE_PATH = config.jolecule.MAP_FILE_PATH
  const MAP_SHARED_FILE_PATH = config.jolecule.MAP_SHARED_FILE_PATH
  const PDB_FILE_PATH = config.jolecule.PDB_FILE_PATH
  const PREPROCESSING_SCRIPT = config.jolecule.PREPROCESSING_SCRIPT
  const JOL_STATIC_SCRIPT = config.jolecule.JOL_STATIC_SCRIPT
  const NOBLE_GAS_SYMBOLS = config.jolecule.NOBLE_GAS_SYMBOLS
  const ENERGY_CUTOFF_SETS = config.jolecule.ENERGY_CUTOFF_SETS
  const MAX_ENERGY_CUTOFF = config.jolecule.MAX_ENERGY_CUTOFF
  const MIN_ENERGY_CUTOFF = config.jolecule.MIN_ENERGY_CUTOFF
  const DATA_SERVER_FILE_NUMBERS = [0, 1, 2, 3, 4, 5]
  const DYNAMIC_ENERGYCUTOFFSET = 'dynamic20'

  pdb = pdb.toLowerCase()
  exports.pdb = pdb
  exports.ENERGY_CUTOFF_SETS = ENERGY_CUTOFF_SETS
  exports.isDefaultEnergyCutoffSet =
    Object.keys(ENERGY_CUTOFF_SETS).indexOf(energyCutoffSet) >= 0
  exports.isDynamicEnergyCutoffSet =
    (energyCutoffSet === DYNAMIC_ENERGYCUTOFFSET)
  exports.isNumericEnergyCutoffSet =
    numeral(energyCutoffSet) &&
    parseFloat(energyCutoffSet) <= MAX_ENERGY_CUTOFF &&
    parseFloat(energyCutoffSet) >= MIN_ENERGY_CUTOFF
  exports.isEnergyCutoffSet = function () {
    return exports.isDefaultEnergyCutoffSet || exports.isNumericEnergyCutoffSet
  }
  if (exports.isNumericEnergyCutoffSet) {
    energyCutoffSet = numeral(energyCutoffSet).format('0.0')
  }
  exports.energyCutoffSet = energyCutoffSet

  const baseLocalPath = function () {
    return `${config.web.baseStatic}/data/${pdb}`
  }

  const mapFileRemotePath = function (nobleGas) {
    return `${MAP_FILE_PATH}/${pdb}/${pdb}.${nobleGas}.map`
  }
  const mapSharedPath = function () {
    if (MAP_SHARED_FILE_PATH) {
      return `${MAP_SHARED_FILE_PATH}/${pdb}`
    } else {
      return false
    }
  }
  const mapFileSharedPath = function (nobleGas) {
    if (MAP_SHARED_FILE_PATH) {
      return `${MAP_SHARED_FILE_PATH}/${pdb}/${pdb}.${nobleGas}.map`
    } else {
      return false
    }
  }
  const mapLocalPath = function (nobleGas) {
    return `${config.web.baseStatic}/data/${pdb}/maps/${nobleGas}`
  }
  const mapFileLocalPath = function (nobleGas) {
    return `${
      config.web.baseStatic
    }/data/${pdb}/maps/${nobleGas}/${pdb}.${nobleGas}.map`
  }

  const pdbFileRemotePath = function () {
    const pdbGroup = pdb.substring(1, 3)
    return `${PDB_FILE_PATH}/${pdbGroup}/pdb${pdb}.ent.gz`
  }
  const pdbStructureFileLocalPath = function () {
    return `${config.web.baseStatic}/data/${pdb}/pdbs/pdb${pdb}.ent.gz`
  }
  const pdbFileLocalPath = function () {
    return `${config.web.baseStatic}/data/${pdb}/pdbs/${pdb}.pdb`
  }

  const processedPdbLocalPath = function () {
    return `${config.web.baseStatic}/data/${pdb}/pdbs/${energyCutoffSet}`
  }
  const processedPdbFileLocalPath = function (nobleGas) {
    return `${
      config.web.baseStatic
    }/data/${pdb}/pdbs/${energyCutoffSet}/${pdb}.${nobleGas}.pdb`
  }

  const dataServerLocalPathClient = function () {
    return `/data/${pdb}/dataServers/${energyCutoffSet}`
  }
  const dataServerLocalPath = function () {
    return `${
      config.web.baseStatic
    }/data/${pdb}/dataServers/${energyCutoffSet}`
  }
  const dataServerFileLocalPath = function (i) {
    return `${
      config.web.baseStatic
    }/data/${pdb}/dataServers/${energyCutoffSet}/data-server${i}.js`
  }
  const dataServerRoute = function () {
    return `/data/${pdb}/${energyCutoffSet}`
  }

  exports.paths = {
    mapFileRemotePaths: NOBLE_GAS_SYMBOLS.map(mapFileRemotePath),
    mapSharedPath: mapSharedPath(),
    mapLocalPaths: NOBLE_GAS_SYMBOLS.map(mapLocalPath),
    mapFileLocalPath: NOBLE_GAS_SYMBOLS.map(mapFileLocalPath),
    pdbFileRemotePath: mapFileLocalPath(),
    pdbFileLocalPath: pdbFileLocalPath(),
    processedPdbLocalPath: processedPdbLocalPath(),
    processedPdbFileLocalPath: NOBLE_GAS_SYMBOLS.map(
      processedPdbFileLocalPath),
    dataServerLocalPathClient: dataServerLocalPathClient(),
    dataServerLocalPath: dataServerLocalPath(),
    dataServerFileLocalPaths: DATA_SERVER_FILE_NUMBERS.map(
      dataServerFileLocalPath
    ),
    dataServerRoute: dataServerRoute(),
    baseLocalPath: baseLocalPath()
  }

  exports.ensureJoleculeDataServers = async function () {
    await ensureLocalFiles()
    await ensurePreProcessingFiles()
    return ensureJoleculeStatic()
  }

  const getEnergyCutOffs = async function () {
    if (exports.isDynamicEnergyCutoffSet) {
      return getDynamicEnergyCutoffSet()
    } else if (exports.isDefaultEnergyCutoffSet) {
      return ENERGY_CUTOFF_SETS[energyCutoffSet]
    } else if (exports.isNumericEnergyCutoffSet) {
      return [
        energyCutoffSet,
        energyCutoffSet,
        energyCutoffSet,
        energyCutoffSet,
        energyCutoffSet
      ]
    } else {
      throw new Error(
        "'" +
        energyCutoffSet +
        "' is not a valid energyCutoffSet (value must be between " +
        MAX_ENERGY_CUTOFF +
        ' and ' +
        MIN_ENERGY_CUTOFF +
        '). '
      )
    }
  }

  const getDynamicEnergyCutoffSet = async function () {
    const searchOptions = {}
    searchOptions.where = {
      'pdb': pdb
    }
    searchOptions.order = models.sequelize.literal(
      "case when element = 'He' then 5 when element = 'Ne' then 4 when element = 'Ar' then 3 when element = 'Kr' then 2 when element = 'Xe' then 1 else null end ASC"
    )
    searchOptions.limit = 5
    let results = await models.pdb.findAll(
      searchOptions
    )
    if (results.length === 5) {
      let energyCutoffSet = []
      results.forEach(row => {
        energyCutoffSet.push(parseFloat(row.binding_energy_20))
      })
      return energyCutoffSet
    }
    throw new Error('No valid Dynamic Cutoffset Found')
  }

  var energyCutoffs = await getEnergyCutOffs()

  const ensureLocalFiles = function () {
    const localFiles = []
    localFiles.push(getMapFiles())
    localFiles.push(getPdbFile())
    return Promise.all(localFiles)
  }

  const getMapFiles = function () {
    console.log('Checking for Map files')
    return Promise.all(NOBLE_GAS_SYMBOLS.map(getMapFile))
  }

  const getMapFile = function (nobleGas) {
    const remoteFilePath = mapFileRemotePath(nobleGas)
    const sharedFilePath = mapFileSharedPath(nobleGas)
    const localFilePath = mapFileLocalPath(nobleGas)
    try {
      return ensureFileWithRemoteFile(
        localFilePath,
        remoteFilePath,
        sharedFilePath
      )
    } catch (err) {
      throw new Error(
        "There are no available map files for the PDB '" +
        pdb +
        "'<br/>If you wish to view the PDB on jolecule please click <a href='http://jolecule.appspot.com/pdb/" +
        pdb +
        "#view:000000'>here</a>"
      )
    }
  }

  const checkMapFile = async function (nobleGas = 'He') {
    const sharedFilePath = mapFileSharedPath(nobleGas)
    const localFilePath = mapFileLocalPath(nobleGas)
    let fileName = checkIfFile(sharedFilePath)
    if (await fileName) {
      return fileName
    } else {
      return checkIfFile(localFilePath)
    }
  }

  const getPdbFile = async function () {
    console.log('Checking for PDB file')
    let remoteFilePath = pdbFileRemotePath()
    let localStructureFilePath = pdbStructureFileLocalPath()
    let localFilePath = pdbFileLocalPath()
    try {
      await ensureFileWithRemoteFile(localStructureFilePath, remoteFilePath)
      decompressGzFile(localStructureFilePath, localFilePath)
    } catch (err) {
      throw new Error(
        'Failed to find ' +
        pdb +
        ' PDB File due to the following error: ' +
        err +
        " click <a href='/flushcache/" +
        pdb +
        '/' +
        energyCutoffSet +
        "'>here to retry</a>"
      )
    }
  }

  const getProcessedPDBFiles = function () {
    console.log('Checking for PreProcessed files')
    return NOBLE_GAS_SYMBOLS.map(getProcessedPDBFile)
  }

  const getProcessedPDBFile = function (nobleGas, nobleGasIndex) {
    const localFilePath = processedPdbFileLocalPath(nobleGas)
    const energyCutoff = energyCutoffs[nobleGasIndex]
    const args = [nobleGas, energyCutoff]
    return ensureFileWithPreProcessingScript(localFilePath, args)
  }

  const ensureFileWithPreProcessingScript = async function (
    localFilePath,
    args
  ) {
    if (fs.existsSync(localFilePath)) {
      return localFilePath
    } else {
      const localFileDir = path.dirname(localFilePath)
      fs.ensureDirSync(localFileDir)
      await runJoleculePreProcessing(args[0], args[1])
      if (fs.existsSync(localFilePath)) {
        console.log(localFilePath + ' created with cutoff of ' + args[1])
        return localFilePath
      } else {
        throw new Error(
          'failed to create ' + localFilePath + ' with cutoff of ' + args[1]
        )
      }
    }
  }

  const ensurePreProcessingFiles = function () {
    const processedPDBFiles = getProcessedPDBFiles()
    return Promise.all(processedPDBFiles).catch(function (err) {
      throw new Error(
        'Failed to PreProcess map files due to the following error: ' +
        err +
        " click <a href='/flushcache/" +
        pdb +
        '/' +
        energyCutoffSet +
        "'>here to retry</a>"
      )
    })
  }

  const runJoleculePreProcessing = function (nobleGas, energyCutoff) {
    const sharedMapPath = mapSharedPath(nobleGas)
    const localMapPath = mapLocalPath(nobleGas)
    const mapPath = sharedMapPath || localMapPath
    return runScriptAsync(
      PREPROCESSING_SCRIPT, [
        '-e',
        nobleGas,
        '-u',
        energyCutoff,
        '-s',
        SPACIAL_CUTOFF,
        '-o',
        processedPdbLocalPath() + '/',
        pdb
      ], {
        cwd: mapPath + '/'
      }
    )
  }

  const ensureJoleculeStatic = async function () {
    console.log('Checking for Static files')
    if (checkJoleculeStaticFiles()) {
      return getDataServers()
    } else {
      await runJoleculeStatic()
      try {
        if (checkJoleculeStaticFiles()) {
          removeProcessedMapFiles()
          return getDataServers()
        } else {
          throw new Error(
            'Static script succeeded but Static Files not generated'
          )
        }
      } catch (err) {
        throw new Error(
          'Failed to Build Jolecule Data_Server due to the following error: ' +
          err +
          " click <a href='/flushcache/" +
          pdb +
          '/' +
          energyCutoffSet +
          "'>here to retry</a>"
        )
      }
    }
  }

  const getDataServers = function () {
    let dataServerPromises = []
    for (let i = 0; i <= 5; i++) {
      dataServerPromises.push(getDataServer(i))
    }
    return Promise.all(dataServerPromises)
  }

  const getDataServer = function (fileIndex) {
    const localFilePath = dataServerFileLocalPath(fileIndex)
    return new Promise(function (resolve, reject) {
      fs.readFile(localFilePath, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  const checkJoleculeStaticFiles = function () {
    let result = true
    for (let i = 0; i <= 5; i++) {
      const localFilePath = dataServerFileLocalPath(i)
      if (!fs.existsSync(localFilePath)) {
        console.log(localFilePath + ' not found')
        result = false
      }
    }
    return result
  }

  const removeProcessedMapFiles = function () {
    NOBLE_GAS_SYMBOLS.map(removeProcessedMapFile)
  }

  const removeProcessedMapFile = async function (nobleGas) {
    if (await checkMapFile(nobleGas)) {
      const localFilePath = mapFileLocalPath(nobleGas)
      fs.remove(localFilePath)
    }
  }

  const runJoleculeStatic = function () {
    console.log('Run jol-static')
    fs.ensureDirSync(dataServerLocalPath())
    let scriptArguments = []
    scriptArguments.push('-o')
    scriptArguments.push(dataServerLocalPath())
    scriptArguments.push(pdbFileLocalPath())
    scriptArguments = scriptArguments.concat(
      NOBLE_GAS_SYMBOLS.map(function (nobleGas) {
        return processedPdbFileLocalPath(nobleGas)
      })
    )
    return runScriptAsync(JOL_STATIC_SCRIPT, scriptArguments, {
      cwd: './'
    })
  }

  const isPdb = function () {
    return !!pdb.match(/^\w{4}$/)
  }
  exports.checkMapFile = checkMapFile
  exports.isPdb = isPdb
  exports.getDynamicEnergyCutoffSet = getDynamicEnergyCutoffSet
  return exports
}
