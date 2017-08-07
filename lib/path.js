
var Path;

if (typeof window === 'undefined') {
	Path = require('path');
} else {	Path = {};

	Path.join = function () {
		return Array.prototype.join.call(arguments, '/');
	};

}

module.exports = Path;
