import stream from 'stream';
const { Transform } = stream;

export default class AppendStream extends Transform {

  constructor(options) {
    super({
      readableObjectMode : true,
      writableObjectMode: true
    });

    this.opts = {
      resp: null,
      container: options.container,
      key: options.key,
      blobSvc: options.blobSvc
    };
  }

  _writeToAppendBlobFromText(container, key, data, cb) {
    let { blobSvc } = this.opts;

    blobSvc.getBlobProperties(container, key, (err, result, resp) => {
      if (err !== null) {
        if (resp !== null && resp.statusCode === 404) {
          return blobSvc.createAppendBlobFromText(container, key, data, cb);
        }
        return cb(err, result, resp);
      } else {
        if (result !== null && result.blobType !== 'AppendBlob') {
          return cb(err);
        }
        return blobSvc.appendFromText(container, key, data, cb);
      }
    });
  }

  _transform(data, enc, next) {
    let { container, key } = this.opts;

    this._writeToAppendBlobFromText(container, key, data, (err, res, resp) => {
      delete res.getPropertiesFromHeaders;
      this.opts.resp = Object.assign({}, res, resp);
      next();
    });
  }

  _flush(next) {
    this.push(this.opts.resp);
    next();
  }

}

