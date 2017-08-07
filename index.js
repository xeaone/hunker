
var Each = require('./lib/each');
var Path = require('./lib/path');
var Os = require('./lib/os');
var Fs = require('./lib/fs');

function Hunker (options) {
	var self = this;

	options = options || {};

	self.data = options.data || [];
	self.name = options.name || 'default';
	self.persist = options.persist === undefined ? true : false;
	self.directory = options.directory || Path.join(Os.homedir(), '.hunker');
	self.path = Path.join(self.directory, self.name + '.json');

	if (!Fs.existsSync(self.directory)) {
		Fs.mkdirSync(self.directory);
	}

	if (!Fs.existsSync(self.path)) {
		self.writeSync();
	}

	self.readSync();
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

Hunker.prototype.has = function (key, callback) {
	var self = this;

	Each(self.data, function (index, next) {
		if (key === self.data[index][0]) {
			callback(null, true);
			next(true);
		} else {
			next();
		}
	}, function () {
		callback(null, false);
	});
};

Hunker.prototype.get = function (key, callback) {
	var self = this;

	Each(self.data, function (index, next) {
		if (key === self.data[index][0]) {
			callback(null, self.data[index][1]);
			next(true);
		} else {
			next();
		}
	}, function () {
		callback();
	});
};

Hunker.prototype.set = function (key, value, callback) {
	var self = this, exists = false;

	Each(self.data, function (index, next) {
		if (key === self.data[index][0]) {
			exists = true;

			self.data[index][1] = value;

			self.write(function (error) {
				callback(error);
				next(true);
			});
		} else {
			next();
		}
	}, function () {
		if (!exists) {
			self.data.push([key, value]);
			self.write(callback);
		}
	});
};

Hunker.prototype.remove = function (key, callback) {
	var self = this;

	Each(self.data, function (index, next) {
		if (key === self.data[index][0]) {
			self.data.splice(index, 1)[0][1];

			self.write(function (error) {
				callback(error);
				next(true);
			});
		} else {
			next();
		}
	}, function () {
		callback();
	});
};

Hunker.prototype.forEach = function (callback, context) {
	var self = this;

	Each(self.data, function (index, next) {
		callback.call(context, self.data[index][1], self.data[index][0], index, self.data);
		next();
	});
};

Hunker.prototype.removeById = function (id, callback) {
	var self = this;
	self.data.splice(id, 1);
	self.write(callback);
};

Hunker.prototype.push = function (value, callback) {
	var self = this;
	self.data.push([self.data.length, value]);
	self.write(callback);
};

Hunker.prototype.size = function () {
	return this.data.length;
};

module.exports = Hunker;
