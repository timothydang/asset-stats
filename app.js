var StyleStats = require('stylestats'),
    utils = require('./assets.js'),
    url = require('url'),
    request = require('request'),
    fs = require('fs'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    zlib = require('zlib');


var cdn = "http://dej6bpy8oabji.cloudfront.net/",
    assetPaths = [],
    tmpPath = "./tmp/"
    outputFile = "./results/result";


function unzipContent(fileName) {
  console.log("ungzip file..." + fileName)

  var outputFile = fileName + "." + fileType;
  var gunzip = zlib.createGunzip();
  var input  = fs.createReadStream(fileName);
  var output = fs.createWriteStream(outputFile);

  input.pipe(gunzip).pipe(output);

  gunzip.on('end', function(body) {
    console.log("done ungzipping...")

    parseStyle(outputFile);
  });
}

function download_file(file_url) {

  // extract the file name
  var file_name = url.parse(file_url).pathname.split('/').pop() + ".tmp";

  // create an instance of writable stream
  var file = fs.createWriteStream(tmpPath + file_name);

  // execute curl using child_process' spawn function
  var curl = spawn('curl', [file_url]);
  // add a 'data' event listener for the spawn instance

  curl.stdout.on('data', function(data) { file.write(data); });

  // add an 'end' event listener to close the writeable stream
  curl.stdout.on('end', function(data) {
    file.end();

    console.log(file_name + ' downloaded');

    unzipContent(tmpPath + file_name);
  });

  // when the spawn child process exits, check if there were any errors and close the writeable stream
  curl.on('exit', function(code) {
    if (code != 0) {
        console.log('Failed: ' + code);
    }
  });

  return file_name;
};

function parseStyle(file) {
  stats = new StyleStats(file);

  stats.parse(function (error, result) {
    console.log("parsing...");

    if(error) {
      console.log(error)
    } else  {
      utils.outputResults(result, outputFile);
    }
  });
}


function retrieveFiles() {
  console.log("retrieving files...");

  assetPaths.forEach(function(path) {
    file = download_file(path);
    console.log(file);
  });
}


function getStyleStats(site, fileName, fileType, skin) {
  var fileName, test;

  request(site, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      fileName = "assets/consumer/skin/"+ skin + "/" + fileName;
      exp = "(" + fileName + ").+?(\." + fileType + ")";
      test = new RegExp(exp);
      fullPath = body.match(test) && body.match(test)[0];

      assetPaths.push(cdn + fullPath);

      retrieveFiles();
    }
  });
}

var skin = 'qantas',
    fileType = 'css',
    fileName = 'common_vendor',
    site = 'http://hotel.qantas.com.au/search/list';

getStyleStats(site, fileName, fileType, skin);
