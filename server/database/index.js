const setup = require('./setup');

function Database(options) {
  const uri = options.uri;
  const service = options.service;

  service.Promise = global.Promise;

  this.connect = function (callback) {
    service.connect(uri, { useNewUrlParser: true });
    callback();
  };

  this.setup = setup;

  return this;
}

module.exports = Database;
