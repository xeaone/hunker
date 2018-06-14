
import Os from './os.js';
import Cycni from 'cycni';
import Path from './path.js';
import System from './system.js';

export default class Hunker {
    
    constructor (options) {
        options = options || {};

        if (!options.name) throw new Error('name required');

        this.name = options.name;
        this.local = options.local === undefined ? true : options.local;
      
        if (this.local) {
            this.home = options.home || Os.homedir();
            this.folder = options.folder || 'hunker';
            this.path = Path.join(this.home, this.folder, this.name);
        } else {
            this.path = this.name;
        }

        const so = {
            local: this.local
        };
        
        this.system = new System(so);
        
    }

    setup () {
        return Promise.resolve().then(function () {
            return this.system.has(this.path);
        }).then(function (has) {
            if (!has) {
                return this.system.writeFolder(this.path);
            }
        });
    }

    parse (data) {
        return Promise.resolve().then(function () {
            return JSON.parse(data);
        });
    }

    stringify (data) {
        return Promise.resolve().then(function () {
            return JSON.stringify(data, null);
        });
    }

    read () {
        return Promise.resolve().then(function () {
            return this.system.readFile(this.path, 'utf8');
        }).then(function (data) {
            return this.parse(data);
        });
    }

    write (data) {
        return Promise.resolve().then(function () {
            return this.stringify(data);
        }).then(function (data) {
            return this.system.writeFile(this.path, data);
        });
    }

    hasById (id) {
        return Promise.resolve().then(function () {
            return this.read();
        }).then(function (data) {
            return data[id] ? true : false;
        });
    }

    getById (id) {
        return Promise.resolve().then(function () {
            return this.read();
        }).then(function (data) {
            return data[id];
        });
    }

    setById (id, item) {
        return Promise.resolve().then(function () {
            return this.read();
        }).then(function (data) {
            id = id < 0 ? data.length + id : id;
            id = id >= data.length ? data.length - 1 : id;
            return Object.assign(data[id], item);
        }).then(function (data) {
            return this.write(data);
        });
    }

    get (options) {
        return Promise.resolve().then(function () {
            return this.read();
        }).then(function (data) {
            options.data = data;
            return Cycni.get(options);
        });
    }

    has (options) {
        return Promise.resolve.then(function () {
            return this.read();
        }).then(function (data) {
            options.data = data;
            return Cycni.has(options);
        });
    }

    size (options) {
        return Promise.resolve().then(function () {
            return this.read();
        }).then(function (data) {
            options.data = data;
            return Cycni.size(options);
        });
    }

    set (options) {
        return Promise.resolve().then(function () {
            return this.read();
        }).then(function (data) {
            options.data = data;
            return Cycni.set(options);
        }).then(function (data) {
            return this.write(data);
        });
    }

    add (options) {
        return Promise.resolve().then(function () {
            return this.read();
        }).then(function (data) {
            options.data = data;
            return Cycni.add(options);
        }).then(function (data) {
            return this.write(data);
        });
    }

    remove (options) {
        return Promise.resolve().then(function () {
            return this.read();
        }).then(function (data) {
            options.data = data;
            return Cycni.remove(options);
        }).then(function (data) {
            return this.write(data);
        });
    }

    push (options) {
        return Promise.resolve().then(function () {
            return this.read();
        }).then(function (data) {
            options.data = data;
            return Cycni.push(options);
        }).then(function (data) {
            return this.write(data);
        });
    }

}

