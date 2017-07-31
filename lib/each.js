
module.exports = function each (start, stop, callback, done) {
	var task, iterator, current = start;

	iterator = function() {
		if (current >= stop) {
			clearInterval(task);

			if (done) {
				done();
			}

		} else {
			callback(current++);
		}
	}

	task = setInterval(iterator, 0);
};

//
// results show over 1000 the async has better performance
//
// console.time('each');
// each(0, 1000, function (n) {
// 	console.log(n);
// });
// console.timeEnd('each');
//
// console.time('original');
// for (var i = 0; i < 1000; i++) {
// 	console.log(i);
// }
// console.timeEnd('original');
