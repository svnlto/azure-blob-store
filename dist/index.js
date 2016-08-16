'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _azureStorage = require('azure-storage');

var _azureStorage2 = _interopRequireDefault(_azureStorage);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AzureBlobStore = function AzureBlobStore() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


  if (!opts.accountName) {
    throw Error('Azure storage configuration error: missing accountName setting');
  }
  if (!opts.accessKey) {
    throw Error('Azure storage configuration error: missing accessKey setting');
  }
  if (!opts.container) {
    throw Error('Azure storage configuration error: missing container setting');
  }

  var container = opts.container;
  var blobSvc = _azureStorage2.default.createBlobService(opts.accountName, opts.accessKey);

  var createWriteStream = function createWriteStream(opts) {
    var azropts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var done = arguments[2];

    if (typeof opts === 'string') opts = { key: opts };
    if (typeof opts === 'function') return createWriteStream(null, opts, azropts);
    if (typeof azropts === 'function') {
      done = azropts, azropts = {};
    }

    opts.key = opts.key || opts.name;

    var proxy = (0, _through2.default)();
    var ws = blobSvc.createWriteStreamToNewAppendBlob(container, opts.key, azropts);

    ws.on('close', function () {
      return done(null, { key: opts.key });
    });

    ws.on('error', function (err) {
      return done(err);
    });

    proxy.pipe(ws);

    return proxy;
  };

  var createReadStream = function createReadStream(opts) {
    if (typeof opts === 'string') opts = { key: opts };
    if (typeof opts === 'function') return createReadStream(null, opts);

    return blobSvc.createReadStream(container, opts.key);
  };

  var remove = function remove(opts, done) {
    if (typeof opts === 'string') opts = { key: opts };
    if (typeof opts === 'function') return remove(null, opts);

    blobSvc.deleteBlob(container, opts.key, function (err, resp) {
      if (err) {
        return done(err);
      }

      return done(null, resp);
    });
  };

  var exists = function exists(opts, done) {
    if (typeof opts === 'string') opts = { key: opts };
    if (typeof opts === 'function') return exists(null, opts);

    blobSvc.getBlobProperties(container, opts.key, function (err, props) {
      if (err && err.code === 'NotFound') {
        return done();
      }
      if (err) {
        return done(err);
      }

      return done(null, props);
    });
  };

  return Object.freeze({
    createWriteStream: createWriteStream,
    createReadStream: createReadStream,
    remove: remove,
    exists: exists
  });
};

exports.default = AzureBlobStore;