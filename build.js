const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/main.jsx'],
    bundle: true,
    minify: true,
    outfile: 'static/bundle.js',
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });
  console.log('Build completed successfully!');
} catch (e) {
  console.error('Build failed:', e);
  process.exit(1);
}
