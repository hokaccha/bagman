'use strict';

var path = require('path');
var swig = require('swig');
var _ = require('underscore');
var vfs = require('vinyl-fs');
var yaml = require('yamljs');
var through2 = require('through2');
var bagman = require('./bagman');

var template = module.exports;

swig.setDefaults({ cache: false });

function loadData(fn) {
  var dir = bagman.get('data_dir');
  var ret = {
    bagman: {
      env: bagman.get('env')
    }
  };

  return vfs.src(dir + '/**/*')
    .pipe(through2.obj(function(file, enc, cb) {
      var data = yaml.load(file.path);
      var name = file.path.replace(file.base, '').replace(/\..+$/, '');
      this.push({ name: name, data: data });
      cb();
    }))
    .on('readable', function() {
      var result = this.read();
      ret[result.name] = result.data;
    })
    .on('end', function() {
      fn(null, ret);
    });
}

template.middleware = function(opts) {
  opts = _.defaults({}, opts, {
    srcDir: bagman.get('src_dir')
  });

  return function(req, res, next) {
    if (req.url.match(/\/$/)) {
      req.url += 'index.html';
    }

    if (req.url.match(/\.html$/)) {
      loadData(function(err, data) {
        if (err) console.error(err); // TODO: Error handling

        var html = swig.compileFile('./' + opts.srcDir + req.url)(data);
        res.end(html);
      });
    }
    else {
      next();
    }
  };
};

template.compile = function() {
  return through2.obj(function(file, enc, cb) {
    var self = this;

    if (!file.path.match(/\.html$/)) {
      this.push(file);
      return cb();
    }

    loadData(function(err, data) {
      if (err) console.error(err); // TODO: Error handling

      file.contents = new Buffer(swig.compileFile(file.path)(data));
      self.push(file);
      cb();
    });
  });
};
