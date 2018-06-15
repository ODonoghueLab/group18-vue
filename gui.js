const childProcess = require('child_process')
const path = require('path')
childProcess.fork(path.join('server/src/bin', 'www'), ['-c'])
