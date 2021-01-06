'use strict';

var path = require('path');
var ExtractTextPlugin = require('sgmf-scripts')['extract-text-webpack-plugin'];
var shell = require('shelljs');
var webpack = require('sgmf-scripts').webpack;

function getCartridges() {
    let cwd = process.cwd();
    let packageJson = require(path.join(cwd, './package.json'));
    let cartridges = packageJson.cartridges;

    cartridges = cartridges.map(cartridge => { return cwd });
    cartridges = cartridges.filter(cartridge => { return shell.find(path.join(cartridge, 'cartridge/client/')).stdout !== ''; });
    return cartridges;
}

function getFiles(cartridges, type) {
    let files = {}, isJS = type === 'js';
    type = isJS ? 'js/*.js' : 'scss/**/*.scss';

    cartridges.forEach(cartridge => {
        shell.ls(path.join(cartridge, 'cartridge/client/**/', type)).forEach(file => {

            let name = isJS ? '' : path.basename(file, `.scss`);

            if (name.indexOf('_') !== 0) {
                let location = path.relative(path.join(cartridge, `cartridge/client`), file).replace(/\\/g, "/");
                location = isJS ? location.substr(0, location.length - 3) : location.substr(0, location.length - 5).replace('scss', 'css');
                files[`./cartridges/${path.basename(cartridge)}/cartridge/static/` + location] = file;
            }
        });
    });

    return files;
};

var cartridges = getCartridges();
var jsFiles = getFiles(cartridges, 'js');
var scssFiles = getFiles(cartridges, 'scss');

//var scssFiles ={ 'default\\css\\global': './cartridge/client/default/scss/global.scss' };
//var jsFiles = { 'default\\js\\main': './cartridge/client/default/js/main.js' }

module.exports = [{
    mode: 'production',
    name: 'js',
    entry: jsFiles,
    output: {
        path: path.resolve('../../'),
        filename: '[name].js'
    }
}, {
    mode: 'none',
    name: 'scss',
    entry: scssFiles,
    output: {
        path: path.resolve('../../'),
        filename: '[name].css'
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        url: false,
                        minimize: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            require('autoprefixer')()
                        ]
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [
                            path.resolve('node_modules'),
                            path.resolve('node_modules/flag-icon-css/sass')
                        ]
                    }
                }]
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin({ filename: '[name].css' })
    ]
}];
