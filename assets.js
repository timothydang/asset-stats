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
        fs = require('fs'),
        results = jsonminify(JSON.stringify(buffer, null, 2)),
        fileName = outputFile + this.getTimeSuffix() + ".json";

    fs.writeFile(fileName, results, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + fileName);
      }
    });
  }

};
