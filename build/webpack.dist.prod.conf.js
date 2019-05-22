/**
 * 打包生成excel.min.js
 *(css内嵌在了js里面，没有分离出来)
 */
'use strict'
const path = require('path')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf-plug')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const vueLoaderConfig = require('./vue-loader.conf')
const utils = require('./utils')



function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
const webpackConfig = merge(baseWebpackConfig, {
//   mode: 'production',
  entry: {
    excel: './src/lib'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    // publicPath: '/dist/',
    publicPath: '/',
    filename: '[name].min.js',
    library: 'vueElementExcel', // library指定的就是你使用require时的模块名，这里便是require("toastPanel")
    libraryTarget: 'umd', //libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的。
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
    // library: {
    //   root: 'Excel',
    //   commonjs: 'excel-public-components',
    // },
    // libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            // options: vueLoaderConfig,
        },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src/lib/components')],
        // exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  
  // 我们的library打包时不将vue和ElementUI打包进去，由引用library者提供，
  // externals: {
  //   'vue': 'Vue',
  //   'vue-router': 'VueRouter',
  //   'element-ui': 'ELEMENT',
  // },
  // externals: {
  //   vue: {
  //     root: 'Vue',
  //     commonjs: 'vue',
  //     commonjs2: 'vue',
  //     amd: 'vue'
  //   },
  //   ElementUI: {
  //     root: 'ElementUI',
  //     commonjs: 'ElementUI',
  //     commonjs2: 'ElementUI',
  //     amd: 'ElementUI'
  //   }
  // },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // new CleanWebpackPlugin(
    //   ['dist/excel.min.js'],
    //   {
    //     root: path.join(__dirname, '../'),
    //     verbose: true,
    //     dry: false
    //   }
    // ),
  ]
})

module.exports = webpackConfig