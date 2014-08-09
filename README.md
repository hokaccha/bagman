# bagman

frontend develpment system.

## Feature

* convention over configuration
* Provides develpment server and static file builder
* Asset Pipeline using [mincer](https://github.com/nodeca/mincer)

## usage

See examples directory.

```
$ cd $BAGMAN_ROOT
$ npm install
$ cd examples/basic
$ ../../bin/bagman server
# or
$ ../../bin/bagman build
```

## custom config

You can customize configuration using `bagman.js`. See also `examples/custom`.

```javascript
var bagman = require('bagman');

bagman.set('src_dir', 'source');
bagman.set('js_dir', 'assets/scripts');
bagman.set('css_dir', 'assets/styles');

bagman.configure('server', function() {
  bagman.set('port', 3000);
});

bagman.configure('build', function() {
  bagman.set('build_assets', ['main.js', 'main.css']);
  bagman.set('build_dir', 'dist');
});
```
