'use strict';

var Lift = {};

Lift.one = function (method) {
	return function () {
		var args = Array.prototype.slice.call(arguments);

		return new Promise(function (resolve, reject) {

			args.push(function(error, data) {
				if (error) {
					return reject(error);
				} else {
					return resolve(data);
				}
			});

			method.apply(null, args);

		});
	};
};

Lift.all = function (source) {
	var target = source.constructor();

	Object.keys(source).forEach(function (key) {
		if (key.indexOf('Sync') !== key.length-4 && typeof source[key] === 'function') {
			target[key] = this.one(source[key]);
		} else {
			target[key] = source[key];
		}
	}, this);

	return target;
};

module.exports = Lift;
