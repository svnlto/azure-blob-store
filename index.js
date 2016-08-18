import azure from 'azure-storage';
import AppendStream from './appendStream';

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

  let { container, accountName, accessKey } = opts;
  let blobSvc = azure.createBlobService(accountName, accessKey);


  const createWriteStream = (opts, azropts = {}, done) => {
    if (typeof opts === 'string') opts = { key: opts };
    if (typeof opts === 'function') return createWriteStream(null, opts, azropts);
    if (typeof azropts === 'function') { done = azropts, azropts = {}; }

    opts.key = opts.key || opts.name;

    let as = new AppendStream({
      blobSvc: blobSvc,
      container: container,
      key: opts.key
    });

    as.on('finish', () => { done(null, { key: opts.key }); });
    as.on('error', (err) => { done(err); });

    return as;
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
