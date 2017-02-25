# multipart-download [![Build Status](https://travis-ci.org/zulhilmizainuddin/multipart-download.svg?branch=master)](https://travis-ci.org/zulhilmizainuddin/multipart-download)

[![NPM](https://nodei.co/npm/multipart-download.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/multipart-download/)

Speed up download of a single file with multiple HTTP GET connections running in parallel

## Class: MultipartDownload

MultipartDownload is an `EventEmitter`.

### start(url, numOfConnections[, saveDirectory])
- `url` &lt;string&gt; Url of file to be downloaded
- `numOfConnections` &lt;number&gt; Number of HTTP GET connections to use for performing the download
- `saveDirectory` &lt;string&gt; Directory to save the downloaded file (Optional)

Starts the download operation from the `url`.

Multiple HTTP GET connections will only be used if the target server supports partial requests.
If the target server does not support partial requests, only a single HTTP GET connection will be used regardless of what the `numOfConnections` is set to.

If the `saveDirectory` parameter was provided, the downloaded file will be saved to the `saveDirectory`.
If the `saveDirectory` parameter was not provided, the downloaded file will not be saved.

#### Event: 'data'
- `data` &lt;string&gt; | &lt;Buffer&gt; Chunk of data received
- `offset` &lt;number&gt; Offset for the chunk of data received

The file being downloaded can be manually constructed and manipulated using the `data` and `offset` received. 

#### Event: 'end'
- `filePath` &lt;string&gt; Downloaded file saved path

`filePath` is the location of the saved file if the `saveDirectory` parameter was provided.
`filePath` will be `null` if the `saveDirectory` parameter was not provided.

### Example

```javascript
const os = require('os');

const MultipartDownload = require('multipart-download');

try {
  new MultipartDownload()
    .start('https://homepages.cae.wisc.edu/~ece533/images/cat.png', 5, os.tmpdir())
    .on('data', (data, offset) => {
      // manipulate data here
    })
    .on('end', (filePath) => {
      console.log(`Downloaded file path: ${filePath}`);
    });
} catch (err) {
  console.log(err);
}
```
