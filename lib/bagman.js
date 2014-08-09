'use strict';

var bagman = module.exports;

// default config
var config = {
  data_dir: 'data',
  js_dir: 'js',
  css_dir: 'css',
  src_dir: 'src',
  build_dir: 'build',
  build_assets: ['app.js', 'app.css'],
  port: 8000
};

bagman.set = function(key, val) {
  config[key] = val;
};

bagman.get = function(key) {
  return config[key];
};

bagman.configure = function(type, fn) {
  if (bagman.get('env') === type) {
    fn();
  }
};
