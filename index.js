
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
		this.write();
	}

	this.read();
}

Hunker.prototype.read = function () {
	if (persist) {
		var data = Fs.readFileSync(this.path);
		this.data = JSON.parse(data);
	}
};

Hunker.prototype.write = function () {
	if (persist) {
		var data = JSON.stringify(this.data, null, '\t');
		Fs.writeFileSync(this.path, data);
	}
};

Hunker.prototype.get = function (key) {
	for (var i = 0; i < this.data.length; i++) {
		if (key === this.data[i][0]) {
			return this.data[i][1];
		}
	}
};

Hunker.prototype.has = function (key) {
	for (var i = 0; i < this.data.length; i++) {
		if (key === this.data[i][0]) {
			return true;
		}
	}

	return false;
};

Hunker.prototype.size = function () {
	return this.data.length;
};

Hunker.prototype.push = function (value) {
	this.data[this.data.length] = [this.data.length, value];
	return this.write();
};

Hunker.prototype.set = function (key, value) {
	for (var i = 0; i < this.data.length; i++) {
		if (key === this.data[i][0]) {
			return this.data[i][1] = value;
		}
	}

	this.data[this.data.length] = [key, value];

	return this.write();
};

Hunker.prototype.remove = function (key) {
	for (var i = 0; i < this.data.length; i++) {
		if (key === this.data[i][0]) {
			this.data.splice(i, 1)[0][1];
			return this.write();
		}
	}
};

Hunker.prototype.removeById = function (id) {
	this.data.splice(id, 1);
	return this.write();
};

Hunker.prototype.forEach = function (callback, context) {
	context = context || null;

	for (var i = 0; i < this.data.length; i++) {
		callback.call(context, this.data[i][1], this.data[i][0], i, this.data);
	}
};

module.exports = Hunker;
