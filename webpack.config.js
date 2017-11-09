const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProduction = process.argv.indexOf('-p') >= 0
const outPut = path.join(__dirname, './dist')
const sourcePath = path.join(__dirname, './src')

module.exports = {
  context: sourcePath,
  entry: {
    main: './index.tsx',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux'
    ]
  },
  output: {
    path: outPut,
    publicPath: '/',
    filename: 'bundle.js'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    mainFields: ['browser', 'main']
  },
  module: {
    loaders: [
      { test: /\.ts$/, enfore: 'pre', loader: 'tslint-loader' },
      { test: /\.tsx?$/, use: isProduction ? 'awesome-typescript-loader?module=es6' : ['react-hot-loader/webpack', 'awesome-typescript-loader']},
      {
        test: /\.css$/, 
        use: ExtractTextPlugin.extract({ 
          fallback: 'style-loader', use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: '!isProduction',
                imprtLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-import')({ addDependencyTo: webpack }),
                  require('postcss-url'),
                  require('postcss-cssnext')(),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({disabled: isProduction})
                ]
              }
            }
          ]
        })
      },
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.png$/, use: 'url-loader?limit=10000' },
      { test: /\.jpg$/, use: 'file-loader' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isProduction === true ? JSON.stringify('production') : JSON.stringify('development')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin({
      filename: 'styles.css',
      disable: !isProduction
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  devServer: {
    contentBase: sourcePath,
    hot: true,
    stats: {
      warning: false
    }
  },
  node: {
    fs: 'empty',
    net: 'empty'
  }
}
