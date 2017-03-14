const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const _ = require('lodash')

module.exports = {
  entry: {
    build: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: '/dist/',
    filename: 'js/[name].js?q=[hash]',
  },
  resolve: {
    extensions: ['.js', '.vue', '.css'],
    alias: {
      components: './src/components',
      view: './src/view',
      assets: './src/assets',
    },
  },
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: ExtractTextPlugin.extract({
            fallback: 'vue-style-loader?sourceMap',
            use: 'css-loader?sourceMap',
          }),
        },
        postcss: [
          require('autoprefixer')({
            browsers: ['last 20 versions'],
          }),
        ],
      },
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader?sourceMap',
        use: 'css-loader?sourceMap',
      }),
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
      loader: 'file-loader',
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
      loader: 'file-loader',
      query: {
        name: 'images/[name].[ext]?q=[hash]',
      },
    }, {
      test: /\.scss$/,
      loader: 'style-loader!css-loader?sourceMap!sass-loader!postcss-loader',
    }],
  },
  // devServer: {
  //   historyApiFallback: true,
  //   noInfo: true,
  //   proxy: {
  //     '/api/*': {
  //       target: 'http://192.168.1.177/cgi-bin/pa/xs',
  //       secure: false,
  //       pathRewrite: {
  //         '^/api': '',
  //       },
  //     },
  //   },
  // },
  plugins: [
    new ExtractTextPlugin({
      allChunks: true,
      filename: 'styles.css?q=[hash]',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
      // any required modules inside node_modules are extracted to vendor
        return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
        )
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
  ],
  devtool: '#eval-source-map',
}

if (process.env.NODE_ENV === 'production') {
  _.assign(module.exports, {
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: './',
      filename: 'js/[name].js?q=[hash]',
    },
    devtool: '#source-map',
    plugins: (module.exports.plugins || []).concat([
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'temp.html',
        inject: true,
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new OptimizeCSSPlugin(),
    ]),
  })
}
