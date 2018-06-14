
import Fs from './fs.js';

export default class System {

    constructor (options) {
        options = options || {};
        this.local = options.local === undefined ? true : options.local;
    }

    async has (path) {
        if (this.local) {
            Fs.existsSync(path);
        } else {
        }
    }

}
