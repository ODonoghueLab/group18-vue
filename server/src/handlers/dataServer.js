const ecache = require('../utilities/ensureProcessingCache.js')
var StringDecoder = require('string_decoder').StringDecoder

async function getDataServers ({
  pdb
}) {
  try {
    let checkedFiles = await ecache.checkFiles({
      params: {
        pdb: pdb
      }
    })
    if (!checkedFiles) {
      throw new Error(`Unable to find dataservers for ${pdb}`)
    }
    const dataServers = []
    var decoder = new StringDecoder('utf8')
    const rawDataservers = await ecache.retrieveDataServersFromCache(
      pdb
    )
    rawDataservers.forEach(dataServer => {
      dataServers.push(decoder.write(dataServer))
    })
    return dataServers
  } catch (err) {
    throw err
  }
}

async function refreshDataServers ({
  pdb
}) {
  ecache.flushCache(
    pdb
  )
  return getDataServers({
    pdb
  })
}

module.exports = {
  'publicGetDataServers': getDataServers,
  refreshDataServers
}
