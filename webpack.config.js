var path = require('path');

module.exports = {
	// define entry point
	entry: "./src/js/script.js",

	// define output point
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "bundle.js"
	},
	node: {
		__dirname: true
	}
};
