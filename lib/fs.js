'use strict';

var Fs, Lift;

if (typeof window === 'undefined') {
	Lift = require('./lift');
	Fs = require('fs');
	Fs = Lift.all(Fs);
} else {
	Fs = {};

	Fs.existsSync = function(path) {
		return localStorage.getItem(path) !== null;
	};

	Fs.readFile = function (path, callback) {
		new Promise(function(resolve, reject) {
			try {
				return resolve(localStorage.getItem(path));
			} catch (e) {
				return reject(e);
			}
		});
	};

	Fs.writeFile = function (path, data, callback) {
		new Promise(function(resolve, reject) {
			try {
				return resolve(localStorage.setItem(path, data));
			} catch (e) {
				return reject(e);
			}
		});
	};

}

module.exports = Fs;
