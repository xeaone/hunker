
var Fs;

if (typeof window === 'undefined') {
	Fs = require('fs');
} else {
	Fs = {};

	Fs.mkdirSync = function () {}

	Fs.existsSync = function(path) {
		return localStorage.getItem(path) !== null;
	};

	Fs.readFileSync = function (path) {
		return localStorage.getItem(path);
	};

	Fs.writeFileSync = function (path, data) {
		localStorage.setItem(path, data)
	};

	Fs.readFile = function (path, callback) {
		try {
			return callback(null, localStorage.getItem(path));
		} catch (e) {
			return callback(e);
		}
	};

	Fs.writeFile = function (path, data, callback) {
		try {
			return callback(null, localStorage.setItem(path, data));
		} catch (e) {
			return callback(e);
		}
	};

}

module.exports = Fs;
