import config from '../config'

export default {
  log() {
    let id = arguments[0]
    let params = Array.prototype.slice.call(arguments, 1)
    if (config.debug) {
      console.log('> ' + id, ...params)
    } else {
      console.log('> ' + id)
    }
  }
}