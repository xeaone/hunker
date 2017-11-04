'use strict';

const Path = require('./lib/path');
const Os = require('./lib/os');
const Fs = require('./lib/fs');
const Cycni = require('cycni');

function Hunker (options) {
	options = options || {};
	this.BREAK = 2;
	this.data = options.data || [];
	this.name = options.name || 'default';
	this.home = options.home || Os.homedir();
	this.persist = options.persist === undefined ? true : false;
	this.folder = Path.join(this.home, 'hunker');
	this.path = Path.join(this.folder, this.name + '.json');
}

Hunker.prototype.setup = async function () {

	if (!Fs.existsSync(this.folder)) {
		await Fs.mkdir(this.folder);
	}

	if (!Fs.existsSync(this.path)) {
		await Fs.writeFile(this.path, '[]');
	}

	await this.read();
};

Hunker.prototype.parse = async function (data) {
	return JSON.parse(data);
};

Hunker.prototype.stringify = async function (data) {
	return JSON.stringify(data, null, '\t');
};

Hunker.prototype.read = async function () {
	const data = await Fs.readFile(this.path, 'utf8');
	this.data = await this.parse(data);
};

Hunker.prototype.write = async function () {
	const data = await this.stringify(this.data);
	await Fs.writeFile(this.path, data);
};

Hunker.prototype.hasById = async function (id) {
	return this.data[id] ? true : false;
};

Hunker.prototype.getById = async function (id) {
	return this.data[id];
};

Hunker.prototype.setById = async function (id, item) {
	id = id < 0 ? this.data.length+id : id;
	id = id >= this.data.length ? this.data.length-1 : id;
	Object.assign(this.data[id], item);
	await this.write();
};

Hunker.prototype.get = async function (opt) {
	opt.data = this.data;
	return await Cycni.get(opt);
};

Hunker.prototype.has = async function (opt) {
	opt.data = this.data;
	return await Cycni.has(opt);
};

Hunker.prototype.size = async function (opt) {
	opt.data = this.data;
	await await Cycni.size(opt);
};

Hunker.prototype.set = async function (opt) {
	opt.data = this.data;
	await Cycni.set(opt);
	await this.write();
};

Hunker.prototype.add = async function (opt) {
	opt.data = this.data;
	await Cycni.add(opt);
	await this.write();
};

Hunker.prototype.remove = async function (opt) {
	opt.data = this.data;
	await Cycni.remove(opt);
	await this.write();
};

Hunker.prototype.push = async function (opt) {
	opt.data = this.data;
	await Cycni.push(opt);
	await this.write();
};

module.exports = Hunker;
