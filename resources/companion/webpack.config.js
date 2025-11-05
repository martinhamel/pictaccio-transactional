const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    entry: ['./dist/public/js/app.js', './dist/public/js/lib/entry.js'],
    mode: 'development',
    output: {
        filename: './public/main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        fallback: {
            fs: false
        }
    }
};