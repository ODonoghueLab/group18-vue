const ecache = require("../utilities/ensureProcessingCache.js");
var StringDecoder = require("string_decoder").StringDecoder;

async function getDataServers({ pdb, energyCutoffSet }) {
  try {
    let checkedFiles = await ecache.checkFiles({
      params: { pdb: pdb, energyCutoffSet: energyCutoffSet }
    });
    if (!checkedFiles) {
      throw `Unable to find dataservers for ${pdb},${energyCutoffSet}`;
    }
    const dataServers = [];
    var decoder = new StringDecoder("utf8");
    const rawDataservers = await ecache.retrieveDataServersFromCache(
      pdb,
      energyCutoffSet
    );
    rawDataservers.forEach(dataServer => {
      dataServers.push(decoder.write(dataServer));
    });
    return dataServers;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getDataServers
};
