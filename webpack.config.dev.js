// Fichier de configuration à utiliser dans un environnement de développement

// La fonction Node.js require permet d'importer un module Node.js installé par défaut ou installé avec NPM

// Webpack (https://webpack.js.org/) : permet de transformer notre code front (Sass, JS avec dépendances, ...) en un code compréhensible par les navigateurs (CSS, JS, ...)
const webpack = require('webpack');
const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const chokidar = require('chokidar');

const watchMode = process.env.NODE_ENV === 'watch';

let config = {
	entry: [ './app/js/app.js', './app/scss/main.scss' ],
	mode: 'development',
	output: {
		path: path.resolve(__dirname, './public'),
		filename: 'js/app.js'
	},
	devtool: 'source-map',
	module: {
		rules: [
			// Sass
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					watchMode
						? // Utilisation du style-loader avec le watcher
							{
								loader: 'style-loader',
								options: {
									sourceMap: true
								}
							}
						: // Utilisation de mini-css-extract-plugin en dehors watcher
							{
								loader: MiniCSSExtractPlugin.loader,
								options: {
									sourceMap: true
								}
							},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					// Permet de compiler le sass
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			// Fonts
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts/',
						publicPath: '../fonts'
					}
				}
			},
			// Images
			{
				test: /\.(jpg|jpeg|png|gif|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'images/',
						publicPath: '../images'
					}
				}
			}
		]
	},
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		hot: true,
		watchContentBase: true,
		port: 3100,
		host: '0.0.0.0',
		before: function(app, server) {
			chokidar.watch([ './app/assets/**/*.html' ]).on('all', function() {
				server.sockWrite(server.sockets, 'content-changed');
			});
		}
	},
	plugins: [
		new MiniCSSExtractPlugin({
			filename: 'css/style.css'
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new CopyPlugin([
			{
				from: 'app/assets/**',
				to: '.',
				toType: 'dir',
				transformPath: (targetPath) => targetPath.replace(/^app\/assets\//, '')
			}
		]),
		new webpack.HotModuleReplacementPlugin(),
		new BrowserSyncPlugin(
			{
				host: '0.0.0.0',
				port: 3000,
				proxy: 'http://localhost:3100/',
				open: 'external'
			},
			{
				reload: false
			}
		)
	]
};

module.exports = config;
