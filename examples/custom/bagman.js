var bagman = require('../../lib/bagman');

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
