
// TODO: add async
var Each = require('./lib/each');

var Path = require('./lib/path');
var Os = require('./lib/os');
var Fs = require('./lib/fs');

function Hunker (options) {
	options = options || {};
	this.data = options.data || [];
	this.name = options.name || 'default';
	this.persist = options.persist === undefined ? true : false;
	this.directory = options.directory || Path.join(Os.homedir(), '.hunker');
	this.path = Path.join(this.directory, this.name + '.json');

	// this.uglify = options.uglify === undefined ? true : false;

	if (!Fs.existsSync(this.directory)) {
		Fs.mkdirSync(this.directory);
	}

	if (!Fs.existsSync(this.path)) {
		this.writeSync();
	}

	this.readSync();
}

Hunker.prototype.readSync = function () {
	if (this.persist) {
		var data = Fs.readFileSync(this.path);
		this.data = JSON.parse(data);
	}
};

Hunker.prototype.writeSync = function () {
	if (this.persist) {
		var data = JSON.stringify(this.data, null, '\t');
		Fs.writeFileSync(this.path, data);
	}
};

Hunker.prototype.read = function (callback) {
	var self = this;

	if (self.persist) {
		Fs.readFile(this.path, function (error, data) {
			self.data = JSON.parse(data);
			callback(error, self.data);
		});
	} else {
		callback();
	}
};

Hunker.prototype.write = function (callback) {
	var self = this;

	if (self.persist) {
		var data = JSON.stringify(self.data, null, '\t');
		Fs.writeFile(self.path, data, function (error) {
			callback(error);
		});
	} else {
		callback();
	}
};

Hunker.prototype.get = function (key, callback) {
	var self = this;

	Each(self.data, function (i, next) {
	// for (var i = 0; i < self.data.length; i++) {
		if (key === self.data[i][0]) {
			callback(self.data[i][1]);
			next(true);
		} else {
			next();
		}
	}, function () {
		callback();
	});
	// }
};

Hunker.prototype.has = function (key, callback) {
	var self = this;

	Each(self.data, function (i, next) {
	// for (var i = 0; i < self.data.length; i++) {
		if (key === self.data[i][0]) {
			callback(true);
			next(true);
		} else {
			next();
		}
	}, function () {
		callback(false);
	});
	// }
};

Hunker.prototype.size = function () {
	return this.data.length;
};

Hunker.prototype.push = function (value, callback) {
	var self = this;

	self.data[self.data.length] = [self.data.length, value];
	self.write(function (error) {
		callback(error);
	});
};

Hunker.prototype.set = function (key, value, callback) {
	var self = this;

	Each(self.data, function (i, next) {
	// for (var i = 0; i < self.data.length; i++) {
		if (key === self.data[i][0]) {
			self.data[i][1] = value;
			self.write(function (error) {
				callback(error);
				next(true);
			});
		} else {
			next();
		}
	}, function () {
		self.data[self.data.length] = [key, value];
		self.write(callback);
	});
	// }
};

Hunker.prototype.remove = function (key, callback) {
	var self = this;

	Each(self.data, function (i, next) {
	// for (var i = 0; i < self.data.length; i++) {
		if (key === self.data[i][0]) {
			self.data.splice(i, 1)[0][1];
			self.write(function (error) {
				callback(error);
				next(true);
			});
		} else {
			next();
		}
	}, function () {
		callback();
	});	// }
};

Hunker.prototype.removeById = function (id, callback) {
	this.data.splice(id, 1);
	this.write(callback);
};

Hunker.prototype.forEach = function (callback, context) {
	var self = this;

	context = context || null;

	Each(self.data, function (i, next) {
		callback.call(context, self.data[i][1], self.data[i][0], i, self.data);
		next();
	});

	// for (var i = 0; i < this.data.length; i++) {
	// 	callback.call(context, this.data[i][1], this.data[i][0], i, this.data);
	// }
};

module.exports = Hunker;
