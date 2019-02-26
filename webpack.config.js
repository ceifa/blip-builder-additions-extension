const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        popup: './src/popup/js/Popup.ts',
        content: './src/content/Content.ts',
        injected: './src/Injected.ts'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "sass-loader",
                }],
                include: /src/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build-dev', 'js')
    },
    plugins: [
        new CopyPlugin(
            [
                { from: './src/resources', to: '../resources', flatten: true },
                { from: './manifest', to: '../manifest' },
                { from: './manifest.json', to: '../' },
                { from: './src/popup/pages', to: '../pages', flatten: true },
                { from: './src/popup/img', to: '../img', flatten: true }
            ],
            {
                copyUnmodified: true
            })
    ]
};