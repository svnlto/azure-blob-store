
# azure-blob-store

[![GuardRails badge](https://badges.guardrails.io/svnlto/azure-blob-store.svg)](https://guardrails.io/)

  Azure Blob storage [abstract-blob-store](http://npmrepo.com/abstract-blob-store)

  [![Build Status](https://travis-ci.org/svnlto/azure-blob-store.svg)](https://travis-ci.org/svnlto/azure-blob-store)

  ![comae](https://img.shields.io/badge/Development%20sponsored%20by-Comae%20Technologies-green.svg)


  [![blob-store-compatible](https://raw.githubusercontent.com/maxogden/abstract-blob-store/master/badge.png)](https://github.com/maxogden/abstract-blob-store)

## Installation

  Install with npm

    $ npm install --save azure-blob-store

## Example

```js
var AzureBlobStore = require('azure-blob-store');

var store = new AzureBlobStore({
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  accountKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  container: process.env.AZURE_STORAGE_CONTAINER
});


// write to azure
fs.createReadStream('/tmp/somefile.txt')
.pipe(store.createWriteStream({ key: 'somefile.txt' }));


// read from azure
store.createReadStream({ key: 'somefile.txt' })
.pipe(fs.createWriteStream('/tmp/somefile.txt'));


// remove
store.remove({ key: 'somefile.txt' }, function(err) {
  store.exists({ key: 'somefile.txt' }, function(err, exists) {
    // exists - if false, blob has been removed
  });
});


// exists
store.exists({ key: 'somefile.txt' }, function(err, exists) {
  // true if blob exists
});

```

###Note:

Currently this only works on existing containers, so you'll have to create a 
container beforehand. 


## API

```js
var AzureBlobStore = require('azure-blob-store');
var store = new AzureBlobStore(options);

```

`options` must be an object that has the following properties:

`accountName` (required) Azure access key. Defaults to `process.env.AZURE_STORAGE_ACCOUNT

`accountKey` (required) Azure access key. Defaults to `process.env.AZURE_STORAGE_ACCESS_KEY`

`container` (required) Azure blob store container to store files in. Defaults to `process.env.AZURE_STORAGE_CONTAINER`

-

```js
 store.createWriteStream(opts, cb);
```


returns a writable stream that you can pipe data to.

`opts` should be an object that has options `key` (will be the filename in
your container)

`opts.azure` additional [parameters](http://azure.github.io/azure-storage-node/BlobService.html#createWriteStreamToNewAppendBlob) to pass to Azure Blob storage

`cb` will be called with `(err)` if there is was an error

-

```js
store.createReadStream(opts, cb);
```

opts should be `{key: string (usually a hash or path + filename}`

`opts.azure` additional [parameters](http://azure.github.io/azure-storage-node/BlobService.html#createReadStream) to pass to Azure Blob storage

-

```js
store.exists(opts, cb);
```

This checks if a blob exists in the store.

If `opts` is a string it should be interpreted as a `key`.
Otherwise `opts` *must* be an object with a `key` property (the same key that you got back from createReadStream). The `cb` should be called with `err, exists`, where `err` is an error if something went wrong during the exists check, and `exists` is a boolean.

```js
store.remove(opts, cb); 
```

This method should remove a blob from the store.

If `opts` is a string is should be interpreted as a `key`.
Otherwise `opts` *must* be an object with a `key` property. If the `cb` is called without an error subsequent calls to `.exists` with the same opts should return `false`.

## License

    The MIT License (MIT)

    Copyright (c) 2016 Sven Lito

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
