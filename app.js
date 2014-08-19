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

function getStyleStats(styleItem) {
  var asset = {};

  request(styleItem.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      relativePath = "assets/consumer/skin/"+ styleItem.skin + "/" + styleItem.fileName;
      exp = "(" + relativePath + ").+?(\.css)";

      var test = new RegExp(exp);
      filePath = body.match(test) && body.match(test)[0];

      asset.path     = cdn + filePath;
      asset.fileType = "css";
      asset.name     = styleItem.fileName;

      assets.push(asset);
      retrieveFile(asset);
    }
  });
}

var sources = require('./sources.js');

(function init() {
  sources.forEach(function(item){

    getStyleStats(item);

  });
}());