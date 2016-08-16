if (!process.env.CI) {
  var dotenv = require('dotenv');
  dotenv.load();
}

import blobTests from 'abstract-blob-store/tests';
import test from 'tape';
import BlobStore from './';

let store = new BlobStore({
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  container: process.env.AZURE_STORAGE_CONTAINER
});

let common = {
  setup: (t, done) => {
    done(null, store);
  },
  teardown: (t, store, blob, done) => {
    if (blob) store.remove(blob, done);
    else done();
  }
};

blobTests(test, common);

