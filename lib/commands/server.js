'use strict';

var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var bagman = require('../bagman');
var assets = require('../assets');
var template = require('../template');

module.exports = function() {
  var app = connect();

  app.use(assets.middleware());
  app.use(template.middleware());
  app.use(serveStatic(bagman.get('src_dir')));

  http.createServer(app).listen(bagman.get('port'), function() {
    console.log('Server started http://localhost:' + this.address().port);
  });
};
