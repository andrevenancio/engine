const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const env = require('yargs').argv.env;

let libraryName = 'engine';
let outputFile;

const pkg = require('./package.json');
const plugins = [];

plugins.push(new webpack.DefinePlugin({
    __LIBRARY__: JSON.stringify(`lowww WebGL ${libraryName}`),
    __VERSION__: JSON.stringify(pkg.version),
    __ENV__: JSON.stringify(env),
}));

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
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        // modules: [__dirname + './src'],
        extensions: ['.js'],
    },
    plugins: plugins,
};

module.exports = config;
