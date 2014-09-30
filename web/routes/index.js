var _ = require('underscore');
var moment = require('moment');
var numeral = require('numeral');

var StyleStats = require('stylestats');
var aliases = require('../node_modules/stylestats/assets/aliases.json');
var fs = require('fs-extra');

exports.index = function(request, response) {
    response.render('index', {
        title: 'CSS Stats'
    });
};

exports.parse = function(request, response) {
    var path = request.body.path;
    var css = request.body.css;

    var skin = request.query.skin;
    var fileName = request.query.file;

    fs.readJson("../analyser/results/" + skin + "-2014-09-30" + ".json", function(err, packageObj) {
        file = _.filter(packageObj, function(file) {
            return file.assetName == fileName;
        })[0];

        response.send(prettify(file));
    });
};

/**
 * Prettify StyleStats data.
 * @param {object} [result] StyleStats parse data. Required.
 * @return {array} prettified data.
 */
function prettify(result) {
    var collections = [];
    Object.keys(result).forEach(function(key) {
        var stats = {};
        stats.name = key;
        stats.prop = aliases[key];
        if (key === 'propertiesCount') {
            var array = [];
            result[key].forEach(function(item) {
                array.push([item.property, item.count]);
            });
            stats.value = array.join('<br>').replace(/\,/g, ': ');
        } else if (key === 'published') {
            stats.value = moment().format('lll');
        } else if (key === 'size' || key === 'gzippedSize' || key === 'dataUriSize') {
            stats.value = numeral(result[key]).format('0.0b').replace(/\.0B/, 'B').replace(/0\.0/, '0');
        } else if (key === 'simplicity' || key === 'ratioOfDataUriSize') {
            stats.value = numeral(result[key]).format('0.0%');
        } else if (key === 'uniqueColor') {
            stats.value = result[key];
            if (stats.value == '') {
                stats.value = 'N/A';
            }
        } else {
            stats.value = Array.isArray(result[key]) ? result[key].join('<br>') : result[key];
            if (stats.value === '') {
                stats.value = 'N/A';
            }
        }
        collections.push(stats);
    });
    return collections;
}
