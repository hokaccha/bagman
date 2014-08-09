'use strict';

var through2 = require('through2');
var del = require('del');
var vfs = require('vinyl-fs');
var bagman = require('../bagman');
var assets = require('../assets');
var template = require('../template');

module.exports = function() {
  var srcDir = bagman.get('src_dir');
  var buildDir = bagman.get('build_dir');

  del.sync(buildDir);

  vfs.src(srcDir + '/**/*')
    .pipe(srcPath())
    .pipe(ignore())
    .pipe(assets.compile())
    .pipe(template.compile())
    .pipe(vfs.dest(buildDir))
    .on('end', function() {
      console.log('build successful: -> ' + buildDir);
    });

  function srcPath() {
    return through2.obj(function(file, enc, cb) {
      file.srcPath = file.path.replace(file.base, '');
      this.push(file);
      cb();
    });
  }

  function ignore() {
    return through2.obj(function(file, enc, cb) {
      var isExcluded = file.srcPath.split('/').some(function(p) {
        return /^_/.test(p);
      });

      if (!isExcluded) {
        this.push(file);
      }

      cb();
    });
  }
};
