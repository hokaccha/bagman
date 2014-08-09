'use strict';

var path = require('path');
var Mincer = require('mincer');
var _ = require('underscore');
var through2 = require('through2');
var bagman = require('./bagman');

var assets = module.exports;

function createEnv(opts) {
  var environment = new Mincer.Environment();
  environment.appendPath(opts.srcDir);
  environment.appendPath(path.join(opts.srcDir, opts.jsDir));
  environment.appendPath(path.join(opts.srcDir, opts.cssDir));
  environment.enable('source_maps');

  return environment;
}

function isAssets(path, jsDir, cssDir) {
  return !!path.match('^(' + jsDir + '|' + cssDir + ')/');
}

assets.middleware = function(opts) {
  opts = _.defaults({}, opts, {
    srcDir: bagman.get('src_dir'),
    jsDir: bagman.get('js_dir'),
    cssDir: bagman.get('css_dir')
  });

  var environment = createEnv(opts);
  var mincerServer = Mincer.createServer(environment);

  return function(req, res, next) {
    if (!isAssets(req.url.slice(1), opts.jsDir, opts.cssDir)) {
      return next();
    }

    mincerServer(req, res);
  };
};

assets.compile = function(opts) {
  opts = _.defaults({}, opts, {
    srcDir: bagman.get('src_dir'),
    jsDir: bagman.get('js_dir'),
    cssDir: bagman.get('css_dir')
  });

  var environment = createEnv(opts);
  var buildAssets = bagman.get('build_assets');

  return through2.obj(function(file, enc, cb) {
    if (!isAssets(file.srcPath, opts.jsDir, opts.cssDir)) {
      this.push(file);
      cb();
      return;
    }

    var filename = _.find(buildAssets, function(name) {
      return file.srcPath.match('^(' + opts.jsDir + '|' + opts.cssDir + ')/' + name);
    });

    if (filename) {
      var asset = environment.findAsset(filename);
      file.path = file.path.replace(/^(.*)\/.*$/, '$1/' + asset.logicalPath);
      file.contents = new Buffer(asset.toString());
      this.push(file);
    }

    cb();
  });
};
