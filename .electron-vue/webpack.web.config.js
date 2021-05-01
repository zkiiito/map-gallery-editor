'use strict'

process.env.BABEL_ENV = 'web'

const path = require('path')
const webpack = require('webpack')

const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

require('dotenv').config();

let webConfig = {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    web: path.join(__dirname, '../src/renderer/main.js')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: true,
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader', 
          {
            loader: 'css-loader',
            options: {
              esModule: false
            }
          },
        ]
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [ path.resolve(__dirname, '../src/renderer') ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset/inline'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({filename: 'styles.css'}),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      nodeModules: false
    }),
    new webpack.DefinePlugin({
      'process.env.IS_WEB': 'true',
      'process.app.version': `"${require('../package.json').version}"`,
      'process.env.GOOGLE_MAPS_API_KEY': `"${process.env.GOOGLE_MAPS_API_KEY}"`,
      'process.env.PROMISE_QUEUE_COVERAGE': 'false'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
  ],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../dist/web')
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.esm.js',
      'EnvComponents': path.join(__dirname, '../src/renderer/components/env/web'),
      'EnvServices': path.join(__dirname, '../src/renderer/services/env/web'),
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  cache: false,
  target: 'web'
}

/**
 * Adjust webConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  webConfig.plugins.push(
    new CopyWebpackPlugin({ patterns: [{
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/web/static'),
        globOptions: {
          ignore: ['.*', 'MapGallery/images/*.jpg'],
        }
      }]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  )

  webConfig.optimization = {
    minimize: true,
    minimizer: [new TerserPlugin()],
  };
}

module.exports = webConfig
