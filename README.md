# multipart-download [![Build Status](https://travis-ci.org/zulhilmizainuddin/multipart-download.svg?branch=master)](https://travis-ci.org/zulhilmizainuddin/multipart-download)

[![NPM](https://nodei.co/npm/multipart-download.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/multipart-download/)

Speed up download of a single file with multiple HTTP GET connections running in parallel

## Class: MultipartDownload

MultipartDownload is an `EventEmitter`.

### start(url[, options])
- `url` &lt;string&gt; Url of file to be downloaded
- `options` &lt;StartOptions&gt; Download options (Optional)
  - `numOfConnections` &lt;number&gt; Number of HTTP GET connections to use for performing the download (Optional)
  - `writeToBuffer` &lt;boolean&gt; Store downloaded data to buffer (Optional)
  - `saveDirectory` &lt;string&gt; Directory to save the downloaded file (Optional)
  - `fileName` &lt;string&gt; Set name of the downloaded file (Optional)
  - `headers` &lt;Object&gt; Set custom HTTP headers (Optional)

Starts the download operation from the `url`.

Multiple HTTP GET connections will only be used if the target server supports partial requests.
If the target server does not support partial requests, only a single HTTP GET connection will be used regardless of what the `numOfConnections` is set to.

If the `numOfConnections` parameter is not provided, a single connection will be used.

If the `writeToBuffer` parameter is set to `true`, the downloaded file will be written into a buffer.

If the `saveDirectory` parameter is provided, the downloaded file will be saved to the `saveDirectory`.

If the `fileName` parameter is provided, the downloaded file will be renamed to `fileName`.
If the `fileName` parameter is not provided, the downloaded file will maintain its original file name.

If the `headers` parameter is provided, the headers will be included in the HTTP request.

#### Event: 'error'
- `err` &lt;Error&gt; Emitted error

#### Event: 'data'
- `data` &lt;string&gt; | &lt;Buffer&gt; Chunk of data received
- `offset` &lt;number&gt; Offset for the chunk of data received

The file being downloaded can be manually constructed and manipulated using the `data` and `offset` received. 

#### Event: 'end'
- `output` &lt;string&gt; Downloaded file buffer or downloaded file saved path

`output` is the buffer of the downloaded file if the `writeToBuffer` parameter is set to `true`.

`output` is the location of the saved file if the `saveDirectory` parameter is provided.

`output` will be `null` if `writeToBuffer` is not set to `true` or `saveDirectory` parameter is not provided.

### ~~start(url[, numOfConnections, saveDirectory])~~ :exclamation: DEPRECATED and REMOVED in v1.0.0

### Example

#### Download without writing to buffer or saving to file

```javascript
const MultipartDownload = require('multipart-download');

new MultipartDownload()
  .start('https://homepages.cae.wisc.edu/~ece533/images/cat.png', {
    numOfConnections: 5
  })
  .on('error', (err) => {
    // handle error here
  })
  .on('data', (data, offset) => {
    // manipulate data here
  })
  .on('end', () => {

  });
```

#### Download and write to buffer

```javascript
const MultipartDownload = require('multipart-download');

new MultipartDownload()
  .start('https://homepages.cae.wisc.edu/~ece533/images/cat.png', {
    numOfConnections: 5,
    writeToBuffer: true
  })
  .on('error', (err) => {
    // handle error here
  })
  .on('data', (data, offset) => {
    // manipulate data here
  })
  .on('end', (buffer) => {
    console.log(`Downloaded file buffer: ${buffer}`);
  });
```

#### Download and save to file

```javascript
const os = require('os');

const MultipartDownload = require('multipart-download');

new MultipartDownload()
  .start('https://homepages.cae.wisc.edu/~ece533/images/cat.png', {
    numOfConnections: 5,
    saveDirectory: os.tmpdir(),
    fileName: 'kitty.png'
  })
  .on('error', (err) => {
    // handle error here
  })
  .on('data', (data, offset) => {
    // manipulate data here
  })
  .on('end', (filePath) => {
    console.log(`Downloaded file path: ${filePath}`);
  });
```
