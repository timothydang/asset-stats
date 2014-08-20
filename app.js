var StyleStats = require('stylestats'),
    utils = require('./assets.js'),
    request = require('request');


var cdn = "http://dej6bpy8oabji.cloudfront.net/",
    outputPath = "./results/";


function parseStyle(file, asset) {
  stats = new StyleStats(file);

  stats.parse(function (error, result) {
    // console.log("parsing...");

    if(error) {
      console.log(error);
    } else  {
      result.assetName = asset.name;
      brandAssets[asset.brand].push(result);

      if (brandAssets[asset.brand].length == brandAssetsCounter[asset.brand]) {
        utils.outputResults(brandAssets[asset.brand], outputPath + asset.brand);
      }
    }
  });
}

function retrieveFile(asset) {
  // console.log("retrieving file...");

  utils.downloadFile(asset, function(tmpFile, asset) {

    utils.unGzipContent(tmpFile, asset, function(css_file, asset) {
      parseStyle(css_file, asset);
    });

  });
}

function getStyleStats(styleItem, brand) {
  var asset = {};

  request(styleItem.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      relativePath = "assets/consumer/skin/"+ brand + "/" + styleItem.fileName;
      exp = "(" + relativePath + ").+?(\.css)";

      var test = new RegExp(exp);
      filePath = body.match(test) && body.match(test)[0];

      asset.path     = cdn + filePath;
      asset.fileType = "css";
      asset.name     = styleItem.fileName;
      asset.brand    = brand;

      retrieveFile(asset);
    }
  });
}

var brands = ['qantas', 'jetstar', 'hooroo'];
var brandAssets = [];
var brandAssetsCounter = [];
var configFiles = [];
var index;

brands.forEach(function(brand) {
  var configFile = require('./sites-' + brand + '.js');
  configFiles.push(configFile);
  brandAssets[brand] = [];
  brandAssetsCounter[brand] = 0;
});

(function init() {
  for(index = 0; index < configFiles.length; index++) {
    configFile = configFiles[index];

    configFile.forEach(function(item){
      getStyleStats(item, brands[index]);
      brandAssetsCounter[brands[index]]++;
    });
  }

}());
