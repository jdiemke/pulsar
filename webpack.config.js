var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: {
        'dragon': './src/examples/dragon/Application.ts',
        'reflection': './src/examples/reflection-dragon/Application.ts',
        'textured-wavefront': './src/examples/textured-wavefront/Application.ts',
        'image': './src/examples/image/Application.ts',
        'torus-knot': './src/examples/torus-knot/Application.ts'
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
                test: /\.(vs|fs|obj|jpg|frag|vert|png)$/,
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
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['textured-wavefront'],
            filename: 'textured-wavefront.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['image'],
            filename: 'image.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['torus-knot'],
            filename: 'torus-knot.html'
        }),
    ]
}
