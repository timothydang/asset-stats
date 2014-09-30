module.exports = function(grunt) {

  grunt.initConfig({
    devperf: {
      options: {
        urls: [
          'http://www.google.com'
        ],
        openResults: true,
        timeout: 5000,
        numberOfRuns: 2,
        resultsFolder: './test'
      }
    }
  });

  grunt.loadNpmTasks('grunt-devperf');
  grunt.registerTask('default', ['devperf']);
};
