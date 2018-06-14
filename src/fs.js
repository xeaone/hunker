
let Fs;

if (typeof window === 'undefined') {

    const Lift = require('./lift');
	
    Fs = require('fs');
	Fs = Lift.all(Fs);

} else {

    Fs = {};

	Fs.existsSync = function (path) {
		return window.localStorage.getItem(path) !== null;
	};

	Fs.mkdir = function (path) {
		return new Promise(function (resolve, reject) {
			try {
				window.localStorage.setItem(path, '[]');
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	};

	Fs.readFile = function (path) {
		return new Promise(function (resolve, reject) {
			try {
                var result = window.localStorage.getItem(path);
				resolve(result);
			} catch (e) {
				reject(e);
			}
		});
	};

	Fs.writeFile = function (path, data) {
		return new Promise(function (resolve, reject) {
			try {
				window.localStorage.setItem(path, data);
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	};

}

export default Fs;
