
var Os;

if (typeof window === 'undefined') {
	Os = require('os');
} else {
	Os = {};

	Os.homedir = function () {
		return '/home';
	}

}

module.exports = Os;
