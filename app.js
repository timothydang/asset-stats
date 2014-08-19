var StyleStats = require('stylestats'),
    utils = require('./assets.js'),
    request = require('request');


var cdn = "http://dej6bpy8oabji.cloudfront.net/",
    assets = [],
    outputPath = "./results/";


function parseStyle(file, asset) {
  stats = new StyleStats(file);

  stats.parse(function (error, result) {
    console.log("parsing...");

    if(error) {
      console.log(error);
    } else  {
      utils.outputResults(result, outputPath + asset.name);
    }
  });
}

function retrieveFile(asset) {
  console.log("retrieving file...");

  utils.downloadFile(asset, function(tmpFile, asset) {

    utils.unGzipContent(tmpFile, asset, function(css_file, asset) {
      parseStyle(css_file, asset);
    });

  });
}

function getStyleStats(site, fileNames, fileType, skin) {
  fileNames.forEach(function(fileName) {
    var asset = {};

    request(site, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        relativePath = "assets/consumer/skin/"+ skin + "/" + fileName;
        exp = "(" + relativePath + ").+?(\." + fileType + ")";

        var test = new RegExp(exp);
        filePath = body.match(test) && body.match(test)[0];

        asset.path     = cdn + filePath;
        asset.fileType = fileType;
        asset.name     = fileName;

        assets.push(asset);
        retrieveFile(asset);
      }
    });

  });
}

var skin = 'qantas',
    fileType = 'css',
    fileNames = ['common_vendor','common_app','search'],
    site = 'http://hotel.qantas.com.au/search/list';

getStyleStats(site, fileNames, fileType, skin);
