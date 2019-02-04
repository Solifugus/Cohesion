
// Condition
// Purpose: to resynchronize multiple asynchronous calls and/or setup statefully designed processes

class Condition {
	constructor( debug = false ) {
		this.debug   = debug;
		this.watched = {};
	}

	// e.g. this.register([a,b,c], ()=>{..}, ()={..});
	register( names, test, action, id ) {
		if( !Array.isArray(names) ) names = [names];
		for( var i = 0; i < names.length; i += 1 ) {
			if( typeof names[i] !== 'string' ) throw 'Condition could not register because specified variable name not a string (' + JSON.stringify(names[i]) + ').';
			this.watched[names[i]] = { test:test, action:action, value:undefined, id:id };
		}
	}

	// Get or Set a Watched Value; if set, run associated test and, if true, run associated action
	value( name, newValue ) {
		let watched = this.watched[name];
		if( watched === undefined ) throw 'Condition cannot access non-registered variable ' + JSON.stringify(name) + '.';
		
		if( newValue === undefined ) {
			console.log( 'Requested to read "' + name + '", which is ' + JSON.stringify(watched.value) );
			return watched.value;
		}
		else {
			console.log( 'Requested to assign "' + name + '" to ' + JSON.stringify(newValue) );
			watched.value = newValue;
			//if( watched.test() ) watched.action();
			if( watched.test.bind(this)() ) watched.action.bind(this)();
		}
	}


}

exports.Condition = Condition;

