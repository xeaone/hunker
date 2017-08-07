var Hunker = require('./index');
var Path = require('path');

var options = {
	name: 'users',
	directory: Path.join(process.cwd(), '.hunker')
};

var Users = new Hunker(options);

Users.push({ name: 'alex' }, function (error) {
	if (error) throw error;

	Users.push({ name: 'jon' }, function (error) {
		if (error) throw error;

		Users.set('key', { name: 'dude' }, function (error) {
			if (error) throw error;

			Users.forEach(function (key, value) {
				console.log(value);
			});
		});
	});
});
