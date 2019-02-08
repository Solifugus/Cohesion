#!/usr/bin/env nodejs

const {Cohesion} = require('./cohesion.js');

class Application extends Cohesion {
	constructor() {
		super();
		this.setReaction( 'dostuff1', this.test1, this.action1 );
		this.setTrigger(['state1','state2'], 'dostuff1');
	}

	run() {
		this.trigger('state1',true);
		this.trigger('state2',true);
	}

	test1() {
		let result = true;
		console.log('Test1 Result: ' + result);
		return result;
	}

	action1() {
		console.log('Performing Action1..');
	}
}

let application = new Application();
application.run();


