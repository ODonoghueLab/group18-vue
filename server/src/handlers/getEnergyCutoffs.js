const joleculeHelpers = require('../utilities/joleculeHelpers.js')

async function getEnergyCutoffs ({
  pdb
}) {
  let jol = await joleculeHelpers.set(pdb)
  try {
    let result = await jol.getDynamicEnergyCutoffSet()
    return result
  } catch (e) {
    return jol.ENERGY_CUTOFF_SETS['high']
  }
}

module.exports = {
  'publicGetEnergyCutoffs': getEnergyCutoffs
}
