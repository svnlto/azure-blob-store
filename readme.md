
# azure-blob-store

  Azure Blob storage [abstract-blob-store](http://npmrepo.com/abstract-blob-store)

  [![Build Status](https://travis-ci.org/svnlto/azure-blob-store.svg)](https://travis-ci.org/svnlto/azure-blob-store)

  ![comae](https://img.shields.io/badge/Development%20sponsored%20by-Comae%20Technologies-green.svg)


  [![blob-store-compatible](https://raw.githubusercontent.com/maxogden/abstract-blob-store/master/badge.png)](https://github.com/maxogden/abstract-blob-store)

## Installation

  Install with npm

    $ npm install azure-blob-store

## Example

```js
var azureblobs = require('azure-blob-store');

var store = azureblobs({
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  accountKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  container: process.env.AZURE_STORAGE_CONTAINER
});


// write to azure
fs.createReadStream('/tmp/somefile.txt')
.pipe(store.createWriteStream({ key: 'somefile.txt' }))


// read from azure
store.createReadStream({ key: 'somefile.txt' })
.pipe(fs.createWriteStream('/tmp/somefile.txt'))

// exists
store.exists({ key: 'somefile.txt' }, function(err, exists){
})
```

## API

### var azure = require('azure-blob-store')(options)

`options` must be an object that has the following properties:

`accountName` (required) Azure access key. Defaults to process.env.AZURE_STORAGE_ACCOUNT

`accountKey` (required) Azure access key. Defaults to process.env.AZURE_STORAGE_ACCESS_KEY

`container` (required) Azure blob store container to store files in. Defaults to process.env.AZURE_STORAGE_CONTAINER


### azure.createWriteStream(opts, cb)

returns a writable stream that you can pipe data to.

`opts` should be an object that has options `key` (will be the filename in
your container)

`opts.params` additional [parameters](https://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-how-to-use-blob-storage/#set-up-an-azure-storage-connection) to pass to Azure Blob storage

`cb` will be called with `(err)` if there is was an error

### azure.createReadStream(opts)

opts should be `{key: string (usually a hash or path + filename}`

`opts.params` additional [parameters](https://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-how-to-use-blob-storage/#set-up-an-azure-storage-connection) to pass to Azure Blob storage

returns a readable stream of data for the file in your container whose key matches

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
