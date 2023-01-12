var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        'dragon': './src/examples/dragon/Application.ts',
        'reflection': './src/examples/reflection-dragon/Application.ts',
        'textured-wavefront': './src/examples/textured-wavefront/Application.ts',
        'image': './src/examples/image/Application.ts',
        'torus-knot': './src/examples/torus-knot/Application.ts',
        'particles': './src/examples/particles/Application.ts',
        'game': './src/examples/game/Application.ts',
        'render-to-texture': './src/examples/render-to-texture/Application.ts',
        'text': './src/examples/text/Application.ts',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist'),
        clean: true
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
                test: /\.(vs|fs|obj|jpg|frag|vert|png)$/,
                type: 'asset/resource'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            BUILD_TIME: JSON.stringify(new Date().toISOString())
        }),
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
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['particles'],
            filename: 'particles.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['game'],
            filename: 'game.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['render-to-texture'],
            filename: 'render-to-texture.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['text'],
            filename: 'text.html'
        })
    ]
}
