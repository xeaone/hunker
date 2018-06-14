
let Tick;

if (typeof window === 'undefined') {
	
    Tick = process.nextTick;

} else {
	
    Tick = setTimeout;

}

export default Tick;
