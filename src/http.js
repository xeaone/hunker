
let Http;

if (typeof window === 'undefined') {
    
    Http = require('http');

} else {

    Http = {};

}

export default Http;
