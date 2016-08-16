import azure from 'azure-storage';
import through from 'through2';

const AzureBlobStore = (opts={}) => {

  if (!opts.accountName) {
    throw Error('Azure storage configuration error: missing accountName setting');
  }
  if (!opts.accessKey) {
    throw Error('Azure storage configuration error: missing accessKey setting');
  }
  if (!opts.container) {
    throw Error('Azure storage configuration error: missing container setting');
  }

  let container = opts.container;
  let blobSvc = azure.createBlobService();


  const createWriteStream = (opts, azropts = {}, done) => {
    if (typeof opts === 'string') opts = { key: opts };
    if (typeof opts === 'function') return createWriteStream(null, opts, azropts);
    if (typeof azropts === 'function') { done = azropts, azropts = {}; }

    opts.key = opts.key || opts.name;

    let proxy = through();
    let ws = blobSvc.createWriteStreamToNewAppendBlob(container, opts.key, azropts);

    ws.on('close', () => {
      return done(null, { key: opts.key });
    });

    ws.on('error', (err) => {
      return done(err);
    });

    proxy.pipe(ws);

    return proxy;
  };


  const createReadStream = (opts) => {
    if (typeof opts === 'string') opts = { key: opts };
    if (typeof opts === 'function') return createReadStream(null, opts);

    return blobSvc.createReadStream(container, opts.key);
  };


  const remove = (opts, done) => {
    if (typeof opts === 'string') opts = { key: opts };
    if (typeof opts === 'function') return remove (null, opts);

    blobSvc.deleteBlob(container, opts.key, (err, resp) => {
      if (err) { return done(err); }

      return done(null, resp);
    });
  };


  const exists = (opts, done) => {
    if (typeof opts === 'string') opts = { key: opts };
    if (typeof opts === 'function') return exists(null, opts);

    blobSvc.getBlobProperties(container, opts.key, (err, props) => {
      if (err && err.code === 'NotFound') { return done(); }
      if (err) { return done(err); }

      return done(null, props);
    });
  };


  return Object.freeze({
    createWriteStream,
    createReadStream,
    remove,
    exists
  });

};

export default AzureBlobStore;
