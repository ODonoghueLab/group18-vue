const childProcess = require('child_process')
const fs = require('fs-extra')
const request = require('request')
const zlib = require('zlib')
const path = require('path')

var runScriptAsync = function (scriptPath, args, options) {
  return new Promise(function (resolve, reject) {
    runScript(scriptPath, args, options, resolve, reject)
  })
}

function runScript (scriptPath, args, options, success, fail) {
  var invoked = false
  scriptPath = path.join(__dirname, scriptPath)
  console.log(scriptPath, args, options)
  console.log('cd ' + options.cwd + ';' + scriptPath + ' ' + args.join(' '))
  var process = childProcess.spawn(scriptPath, args, options)
  process.on('error', function (err) {
    if (invoked) return
    invoked = true
    fail(err)
  })
  process.on('exit', function (code) {
    if (invoked) return
    invoked = true
    var err = code === 0 ? null : new Error('exit code ' + code)
    if (err) {
      fail(err)
    } else {
      success()
    }
  })
}

var checkIfFile = function (fileName) {
  if (fileName) {
    return fsStatAsync(fileName)
  } else {
    return Promise.resolve(false)
  }
}

function fsStatAsync (fileName) {
  return new Promise(function (resolve, reject) {
    fs.stat(fileName, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false)
        } else {
          reject(err)
        }
      } else {
        if (stats.isFile()) {
          resolve(fileName)
        } else {
          reject(new Error(fileName + 'is not a file'))
        }
      }
    })
  })
}

function ensureDirectorySync (directory) {
  fs.ensureDirSync(directory)
}

var decompressGzFile = function (inputFile, outputFile) {
  const gzip = zlib.createGunzip()
  const inp = fs.createReadStream(inputFile)
  const out = fs.createWriteStream(outputFile)
  inp.pipe(gzip).pipe(out)
}

function getRemoteFile (localFilePath, remoteFilePath) {
  return new Promise(function (resolve, reject) {
    var localFileDir = path.dirname(localFilePath)
    console.log(localFilePath + ' does not exist creating directory ' +
      localFileDir)
    ensureDirectorySync(localFileDir)
    var remoteFileStream = request(remoteFilePath)
    remoteFileStream.pause()
    remoteFileStream.on('end', function () {
      resolve(localFilePath)
    })
    remoteFileStream.on('error', reject)
    remoteFileStream.on('response', function (resp) {
      if (resp.statusCode === 200) {
        console.log('Generating missing file:' + localFilePath +
          ' from ' + remoteFilePath)
        remoteFileStream.pipe(fs.createWriteStream(localFilePath))
        remoteFileStream.resume()
      } else {
        reject(new Error('Could not retrieve file from ' +
          remoteFilePath + '. Received StatusCode: ' + resp.statusCode
        ))
      }
    })
  })
}

var ensureFileWithRemoteFile = function (localFilePath, remoteFilePath,
  sharedFilePath) {
  return checkIfFile(sharedFilePath)
    .then(function (fileName) {
      if (fileName) {
        return fileName
      } else {
        return checkIfFile(localFilePath)
      }
    })
    .then(function (fileName) {
      if (fileName) {
        return fileName
      } else {
        return getRemoteFile(localFilePath, remoteFilePath)
      }
    })
    .then(function (fileName) {
      if (fileName) {
        return fileName
      } else {
        return checkIfFile(localFilePath)
      }
    }).then(function (fileName) {
      if (fileName) {
        return fileName
      } else {
        throw new Error('Failed to create ' + localFilePath + ' from ' +
          remoteFilePath)
      }
    })
}

exports.runScriptAsync = runScriptAsync
exports.ensureFileWithRemoteFile = ensureFileWithRemoteFile
exports.decompressGzFile = decompressGzFile
exports.checkIfFile = checkIfFile
