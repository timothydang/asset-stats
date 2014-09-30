var fs = require('fs-extra'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    url = require('url');

var tmpPath = "./tmp/";


module.exports = {

  getTimeSuffix: function() {
    var t = new Date(),
        month = t.getMonth() + 1,
        date = t.getDate();

    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    return "-" + t.getFullYear() + "-" + month + "-" + date;
  },

  outputResults: function(buffer, outputFile) {
    var jsonminify = require("jsonminify"),
        results = jsonminify(JSON.stringify(buffer, null, 2)),
        fileName = outputFile + this.getTimeSuffix() + ".json";

    fs.writeFile(fileName, results, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + fileName);
      }
    });
  },

  clean: function() {
    console.log("cleaning out temporary files");
    fs.remove(tmpPath);
    fs.mkdirpSync(tmpPath);
  },

  unGzipContent: function (tmpFileName, asset, callback) {
    console.log("ungzip file..." + tmpFileName);
    var zlib = require('zlib');

    var outputFile = tmpFileName + "." + asset.fileType;
    var gunzip = zlib.createGunzip();
    var input  = fs.createReadStream(tmpFileName);
    var output = fs.createWriteStream(outputFile);

    input.pipe(gunzip).pipe(output);

    gunzip.on('end', function(body) {
      console.log("done ungzipping...")

      if(callback)
        callback(outputFile, asset);
    });
  },

  downloadFile: function(asset, callback) {

    // extract the file name
    var tmpFile = url.parse(asset.path).pathname.split('/').pop() + ".tmp";

    // create an instance of writable stream
    var file = fs.createWriteStream(tmpPath + tmpFile);

    // execute curl using child_process' spawn function
    var curl = spawn('curl', [asset.path]);

    curl.stdout.on('data', function(data) {
      file.write(data);
    });

    // add an 'end' event listener to close the writeable stream
    curl.stdout.on('end', function(data) {
      file.end();

      console.log(asset.path + ' downloaded');

      if(callback)
        callback(tmpPath + tmpFile, asset);
    });

    // when the spawn child process exits, check if there were any errors and close the writeable stream
    curl.on('exit', function(code) {
      if (code != 0) {
          console.log('Failed: ' + code);
      }
    });
  }

};
