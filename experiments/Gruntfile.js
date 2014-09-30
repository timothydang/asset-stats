/*
 * grunt-combine-media-queries
 * https://github.com/buildingblocks/grunt-combine-media-queries
 *
 * Copyright (c) 2013 John Cashmore
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'tasks/*.js'],
      options: {
        jshintrc: '.jshintrc'
      },
    },
    clean: {
      tests: ['tmp']
    },
    cmq: {
      options: {
        log: true
      },
      your_target: {
        files: {
          'tmp': ['test/property-new.css']
        }
      },
      dynamic: {
        expand: true,
        cwd: 'test/',
        src: ['*.css'],
        dest: 'tmp/'
      }
    },
    cssmin: {
      my_target: {
        files: [{
          expand: true,
          cwd: 'tmp/',
          src: ['*.css', '!*.min.css'],
          dest: 'tmp/',
          ext: '.min.css'
        }]
      }
    },
    uncss: {
      dist: {
        options: {
          media: [
            '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3 / 2), (min-device-pixel-ratio: 1.5)',
            'only screen and (min-width: 1280px)',
            'only screen and (min-width: 320px) and (max-width: 767px)',
            'only screen and (min-width: 768px)',
            'only screen and (min-width: 1024px)',
            'only screen and (max-height: 840px)'
          ],
          stylesheets: ['property-new.css']
        },
        files: {
          'test/property-new.css': ['test/property_page.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-combine-media-queries');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-release');
  grunt.registerTask('default', ['clean', 'jshint', 'cmq', 'cssmin']);

};
