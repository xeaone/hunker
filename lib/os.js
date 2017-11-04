'use strict';

var Os = {};

if (typeof window === 'undefined') {
	Os = require('os');
} else {

	Os.homedir = function () {
		return '';
	};

}

module.exports = Os;
