/*jshint esversion: 6 */

class AbstractParser {

	constructor () {

		if (this.getDataset === undefined)
			throwError("getDataset");
		if (this.getStackedDataset === undefined)
			throwError("getStackedDataset", this);
		if (this.getLabel === undefined)
			throwError("getLabel");
		if (this.getCategories === undefined)
			throwError("getCategories");

		function throwError (fun, cls) {
			throw new TypeError ("Must implement method " + fun);
		}
	}
}
