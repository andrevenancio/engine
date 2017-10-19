const path = require('path');
const webpack = require('webpack');

const {
    COMPANY,
    NAME,
    PATH_DIST,
    PATH_SOURCE,
    VERSION,
} = require('./webpack.config');

module.exports = {
    cache: true,
    devtool: 'source-map',

    entry: {
        engine: path.join(process.cwd(), PATH_SOURCE, 'index.js'),
    },

    output: {
        path: path.join(process.cwd(), PATH_DIST),
        filename: '[name].js',
        chunkFilename: '[name].js',
        library: NAME,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        publicPath: PATH_DIST,
    },

    devServer: {
        contentBase: path.join(process.cwd()),
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: [],
                },
            },
        ],
    },

    resolve: {
        extensions: ['.js'],
    },

    plugins: [
        new webpack.DefinePlugin({
            __LIBRARY__: JSON.stringify(`${COMPANY} ${NAME}`),
            __VERSION__: VERSION,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.IgnorePlugin(new RegExp('^(fs|ipc)$')),
    ],
};
