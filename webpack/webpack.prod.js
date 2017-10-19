const path = require('path');
const webpack = require('webpack');

const { UglifyJsPlugin } = webpack.optimize;

const {
    COMPANY,
    NAME,
    PATH_DIST,
    PATH_SOURCE,
    VERSION,
} = require('./webpack.config');

module.exports = {
    cache: true,
    devtool: 'cheap-module-source-map',

    entry: {
        engine: [path.join(process.cwd(), PATH_SOURCE, 'index.js')],
    },

    output: {
        path: path.join(process.cwd(), PATH_DIST),
        filename: '[name].min.js',
        chunkFilename: '[name].min.js',
        library: NAME,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        publicPath: PATH_DIST,
    },

    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            __LIBRARY__: JSON.stringify(`${COMPANY} ${NAME}`),
            __VERSION__: VERSION,
        }),
        new UglifyJsPlugin({ minimize: true, beautify: false }),
    ],
};
