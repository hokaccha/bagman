'use strict';

var cli = module.exports;

var fs = require('fs');
var bagman = require('./bagman');
var commands = require('./commands');

cli.run = function() {
  var subcommand = process.argv[2] || 'server';
  var configFile = process.cwd() + '/bagman.js';

  bagman.set('env', subcommand); // server or build

  if (fs.existsSync(configFile)) {
    require(configFile);
  }

  commands[subcommand]();
};
