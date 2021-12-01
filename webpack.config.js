const path = require('path');

module.exports = {
  entry: './src/browser_module/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/browser_module')
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [{ 
      test: /\.ts$/, 
      loader: 'ts-loader',
      options: {
        compilerOptions: {
          declaration: false
        }
      } 
    }]
  }
}
