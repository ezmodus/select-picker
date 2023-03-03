const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


jsConfig = {
  mode: 'none',
  performance: {
    maxEntrypointSize: 2512000,
    maxAssetSize: 2512000
  },
  entry: {
    'select': './src/select.js',
    'demo': './src/demo.js',
    'bootstrap': './src/bootstrap.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(svg)?$/,
        type: 'asset/source'
      },
    ]
  }
};

cssConfig = {
  mode: 'none',
  performance: {
    maxEntrypointSize: 3500000,
    maxAssetSize: 3500000,
  },
  entry: {
    'style': './src/style.scss',
    'demo': './src/demo.scss',
  },
  output: {
    filename: '[name].[chunkhash:8].css',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    })
  ]
};

module.exports = [ jsConfig, cssConfig ]
