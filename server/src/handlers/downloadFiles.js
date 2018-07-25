const ecache = require('../utilities/ensureProcessingCache.js')
var path = require('path')
const config = require('../config')

async function downloadPDBFiles ({
  pdb
}) {
  try {
    let checkedFiles = await ecache.checkFiles({
      params: {
        pdb: pdb
      }
    })
    if (!checkedFiles) {
      throw new Error(`Unable to find pdb files for ${pdb}`)
    }
    const pdbFiles = await ecache.retrievePDBFilesFromCache(pdb)
    let payload = {
      'filename': path.resolve(pdbFiles),
      'data': {
        'success': true
      }
    }
    return payload
  } catch (err) {
    throw err
  }
}

async function downloadMapFiles ({
  pdb
}) {
  try {
    let checkedFiles = await ecache.checkFiles({
      params: {
        pdb: pdb
      }
    })
    if (!checkedFiles) {
      throw new Error(`Unable to find map files for ${pdb}`)
    }
    const mapFiles = await ecache.retrieveMapFilesFromCache(pdb)
    let payload = {
      'filename': path.resolve(mapFiles),
      'data': {
        'success': true
      }
    }
    return payload
  } catch (err) {
    throw err
  }
}

async function downloadReadme ({
  pdb
}) {
  try {
    let payload = {
      'filename': path.join(config.filesDir, 'readme.md'),
      'data': {
        'success': true
      }
    }
    return payload
  } catch (err) {
    throw err
  }
}

module.exports = {
  downloadPDBFiles,
  downloadMapFiles,
  downloadReadme
}
