var Hunker = require('./index');
var Path = require('path');

var options = { name: 'users', directory: Path.join(process.cwd(), '.hunker') };
var Users = new Hunker(options);

Users.push({ name: 'jon' }, function (error) {
	if (error) throw error;

	Users.forEach(function (user) {
		console.log(user);
	});
	
});
