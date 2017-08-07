
var tick = typeof window === 'undefined'  ? process.nextTick : setTimeout;

module.exports = function (array, iterator, final) {
	var index = 0;

	function next (done) {

		index++;

		if (done || index === array.length) {
			if (final) {
				final();
			}
		} else {
			tick(function () {
				iterator(index, next);
			});
		}

	}

	// instead of starting all the iterations, we only start the 1st one
	iterator(0, next);
};

//
// if the operation is long or async this has way better performance
//
// var array = Array(10*100).fill(0);
//
// console.time('async');
// module.exports(array, function (index, next) {
// 	setTimeout(function() {
// 		index+index;
// 		next();
// 	}, 300);
// });
// console.timeEnd('async');
//
// console.time('sync');
// for (var i = 0, l = array.length; i < l; i++) {
// 	setTimeout(function() {
// 		i+i;
// 	}, 300);
// }
// console.timeEnd('sync');
