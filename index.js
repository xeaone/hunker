'use strict';

const Path = require('./lib/path');
const Os = require('./lib/os');
const Fs = require('./lib/fs');

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

Hunker.prototype.hasByIndex = async function (index) {
	return this.data[index] ? true : false;
};

Hunker.prototype.getByIndex = async function (index) {
	return this.data[index];
};

Hunker.prototype.setByIndex = async function (index, item) {
	index = index < 0 ? this.data.length+index : index;
	index = index >= this.data.length ? this.data.length-1 : index;
	Object.assign(this.data[index], item);
	await this.write();
};

Hunker.prototype.traverse = async function (keys, item) {
	for (let i = 0, l = keys.length; i < l; i++) {
		item = item[keys[i]];
	}
	return item;
};

// Hunker.prototype.each = async function (items, callback) {
// 	for (var i = 0, l = items.length; i < l; i++) {
// 		var item = items[i];
// 		var flag = await callback.call(this, item, i, items);
// 		if (flag === this.BREAK) break;
// 	}
// };

Hunker.prototype.find = async function (data) {

	const keys = Array.isArray(data.keys) ? data.keys : [data.keys];
	const value = data.value;
	const last = keys.pop();

	for (let i = 0, l = this.data.length; i < l; i++) {

		let item = this.data[i];
		let copy = await this.traverse(keys, item);

		if (value === copy[last]) {
			return {
				key: last,
				item: copy,
				value: value
			};
		}

	}

};

Hunker.prototype.has = async function (data) {
	const result = await this.find(data);
	return result ? true : false;
};

Hunker.prototype.get = async function (data) {
	const result = await this.find(data);
	return result.item;
};

Hunker.prototype.set = async function (data) {
	const result = await this.find(data);

	if (result) {
		result.item[result.key] = data.data;
	}

	await this.write();
};

// Hunker.prototype.remove = async function (key) {
// 	const index = await this.find(key);
//
// 	if (index) {
// 		this.data.splice(index, 1)[0][1];
// 		await this.write();
// 	}
// };

Hunker.prototype.push = async function (value) {
	this.data.push(value);
	await this.write();
};

// Hunker.prototype.forEach = async function (callback, context) {
// 	for (let i = 0, l = this.data.length; i < l; i++) {
// 		await callback.call(context, this.data[i][1], this.data[i][0], i, this.data);
// 	}
// };
//
// Hunker.prototype.removeById = async function (id) {
// 	this.data.splice(id, 1);
// 	await this.write();
// };
//
// Hunker.prototype.size = function () {
// 	return this.data.length;
// };

module.exports = Hunker;
