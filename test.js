var Hunker = require('./index');
var Path = require('path');

var options = {
	name: 'users',
	home: Path.join(__dirname, 'dev')
};

var Users = new Hunker(options);

(async function () {
	try {

		await Users.setup();

		await Users.push({ name: 'alex' });

		await Users.push({ name: 'jon' });

		await Users.set({
			keys: 'name',
			value: 'jon',
			data: 'dude'
		});

		// await Users.forEach(async function (key, value) {
		// 	console.log(value);
		// });

	} catch (e) {
		console.error(e);
	}
}());
