'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Transform = _stream2.default.Transform;

var AppendStream = function (_Transform) {
  _inherits(AppendStream, _Transform);

  function AppendStream(options) {
    _classCallCheck(this, AppendStream);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AppendStream).call(this, {
      readableObjectMode: true,
      writableObjectMode: true
    }));

    _this.opts = {
      resp: null,
      container: options.container,
      key: options.key,
      blobSvc: options.blobSvc
    };
    return _this;
  }

  _createClass(AppendStream, [{
    key: '_writeToAppendBlobFromText',
    value: function _writeToAppendBlobFromText(container, key, data, cb) {
      var blobSvc = this.opts.blobSvc;


      blobSvc.getBlobProperties(container, key, function (err, result, resp) {
        if (err !== null) {
          if (resp !== null && resp.statusCode === 404) {
            return blobSvc.createAppendBlobFromText(container, key, data, cb);
          }
          return cb(err, result, resp);
        } else {
          if (result !== null && result.blobType !== 'AppendBlob') {
            cb(err);
          }
          return blobSvc.appendFromText(container, key, data, cb);
        }
      });
    }
  }, {
    key: '_transform',
    value: function _transform(data, enc, next) {
      var _this2 = this;

      var _opts = this.opts;
      var container = _opts.container;
      var key = _opts.key;


      this._writeToAppendBlobFromText(container, key, data, function (err, res, resp) {
        delete res.getPropertiesFromHeaders;
        _this2.opts.resp = Object.assign({}, res, resp);
        next();
      });
    }
  }, {
    key: '_flush',
    value: function _flush(next) {
      this.push(this.opts.resp);
      next();
    }
  }]);

  return AppendStream;
}(Transform);

exports.default = AppendStream;