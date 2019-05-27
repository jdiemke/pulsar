var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: {
        'dragon': './src/examples/dragon/Application.ts',
        'reflection': './src/examples/reflection-dragon/Application.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(vs|fs|obj|jpg|frag|vert)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name(file) {
                            return '[path][name].[ext]';
                        }
                    }
                }],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['dragon'],
            filename: 'dragon.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['reflection'],
            filename: 'reflection.html'
        }),
    ]
}
