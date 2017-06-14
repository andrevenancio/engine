/* eslint-disable */
const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env  = require('yargs').argv.env;

let libraryName = 'engine';
let plugins = [];
let outputFile;

if (env === 'build') {
    plugins.push(new UglifyJsPlugin({ minimize: true, beautify: false }));
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
}

const config = {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        publicPath: '/lib/',
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ],
    },
    resolve: {
        // modules: [__dirname + './src'],
        extensions: ['.js']
    },
    plugins: plugins
};

module.exports = config;
