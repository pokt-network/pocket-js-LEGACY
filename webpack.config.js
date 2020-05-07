const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.ts?$/,
            loader: 'ts-loader',
            exclude: [
                /tests/,
                /node_modules\/@pokt-network\/amino-js\/dist\/node.js/
            ],
            options: {
                transpileOnly: true
            }
        }, ],
    },
    plugins: [new ForkTsCheckerWebpackPlugin(), new BundleAnalyzerPlugin()],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'web.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'PocketJS'
    },
    mode: "development",
    optimization: {
        concatenateModules: true,
        minimize: true,
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 6,
            maxInitialRequests: 4,
            automaticNameDelimiter: '~',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};