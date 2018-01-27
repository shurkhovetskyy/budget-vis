const Mode = require ('../config/options').Mode;

const CONFIG = require ('../config/settings');
/*
 *	Returns actual value given data item, desired dimension
 *	and current display mode.
 */
function val (d, dim, mode, year) {
	let yd;	// year data
	// For some categories data might not be available
	// for all years or for all signs. Then return 0.
	const yi = d.data.findIndex(d => d.key == year.toString());
	if (yi == -1)	return 0.0;
	else 			yd = d.data[yi].values;

	if (mode==Mode.SPENDING || mode==Mode.REVENUE)
		return getDatum(yd, mode, dim);

	// Getting objects holding values at different signs.
	const plusData = getDatum(yd, Mode.SPENDING, dim);
	const minusData = getDatum(yd, Mode.REVENUE, dim);

	if (mode==Mode.BAL)
		return plusData + minusData;
	else if (mode == Mode.COMB) {
		const pa = Math.abs(plusData);
		const ma = Math.abs(minusData);
		return pa + ma;
	}
}

function getDatum (data, mode, dimension) {
	// Get index of a sign.
	const i = data.findIndex(d => d.key == mode);
	if (i == -1)	return 0.0;
	else 			return data[i].value[dimension];
}

function getTimeArray (data, mode, dim) {
	let arr = data.filter(d => Object.keys(d).includes(mode));
	arr = arr.shift()[mode];
	arr = arr.filter(d => Object.keys(d).includes(dim));
	arr = arr.shift()[dim];
	return arr;
}

module.exports.getTimeArray = getTimeArray;
module.exports.val = val;
