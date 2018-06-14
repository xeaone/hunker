
let Os = {};

if (typeof window === 'undefined') {

    Os = require('os');

} else {

	Os.homedir = function () {
		return '';
	};

}

export default Os;
