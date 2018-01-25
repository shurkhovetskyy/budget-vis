var path = require('path');

module.exports = {
	// define entry point
	entry: "./src/app.js",

	// define output point
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: "bundle.js"
	},
	node: {
		__dirname: true
	},
	module : {
		loaders : [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				exclude: [
					path.resolve(__dirname, "node_modules"),
				],
				loader: 'babel-loader',
				query: {
					plugins: [
						['transform-runtime', { "spec": true }],
						["transform-class-properties", { "spec": true }],
						["transform-object-rest-spread"],
						["transform-decorators-legacy"]
					],
					presets:['react', 'es2015']
				}
			}
		]
	}
};
