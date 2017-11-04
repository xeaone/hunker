'use strict';

var Fs = {};

if (typeof window === 'undefined') {
	var Lift = require('./lift');
	Fs = require('fs');
	Fs = Lift.all(Fs);
} else {
	
	Fs.existsSync = function(path) {
		return localStorage.getItem(path) !== null;
	};

	Fs.mkdir = function (path) {
		new Promise(function(resolve, reject) {
			try {
				localStorage.setItem(path, '[]');
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	};

	Fs.readFile = function (path) {
		new Promise(function(resolve, reject) {
			try {
				resolve(localStorage.getItem(path));
			} catch (e) {
				reject(e);
			}
		});
	};

	Fs.writeFile = function (path, data) {
		new Promise(function(resolve, reject) {
			try {
				localStorage.setItem(path, data);
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	};

}

module.exports = Fs;
