var dotenv = require('dotenv');
dotenv.load();

var blobTests = require('abstract-blob-store/tests');
var test = require('tape');
var BlobStore = require('./dist/azure-blob-store');

var store = new BlobStore({
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  container: 'comae'
});

var common = {
  setup: function(t, cb) {
    cb(null, store);
  },
  teardown: function(t, store, blob, cb) {
    if (blob) store.remove(blob, cb);
    else cb();
  }
};

blobTests(test, common);

