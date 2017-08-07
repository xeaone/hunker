
var Tick;

if (typeof window === 'undefined') {
	Tick = process.nextTick;
} else {
	Tick = setTimeout;
}

module.exports = Tick;
