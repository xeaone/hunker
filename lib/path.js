
var Path = {};

if (typeof window === 'undefined') {
	Path = require('path');
} else {

	Path.join = function () {
		return Array.prototype.join
			.call(arguments, '/')
			.replace(/\/{2,}/g);
	};

}

module.exports = Path;
