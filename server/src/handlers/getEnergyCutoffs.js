const joleculeHelpers = require('../utilities/joleculeHelpers.js')

async function getEnergyCutoffs ({pdb}) {
  let jol = await joleculeHelpers.set(pdb)
  return jol.getDynamicEnergyCutoffSet()
}

module.exports = {
  'publicGetEnergyCutoffs': getEnergyCutoffs
}
