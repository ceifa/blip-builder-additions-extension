const path = require('path');

module.exports = {
    mode: 'production',
    entry: ['@babel/polyfill', './src/popup/js/startup.js'],
    module: {
        rules: [{
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/env'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                },
                include: /src/
            },
            {
                test: /\.(s|)css$/,
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
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'src', 'popup', 'dist')
    }
};