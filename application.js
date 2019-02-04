#!/usr/bin/env nodejs

const {Condition} = require('./condition.js');

class Application extends Condition {
	constructor() {
		super();
		this.register(['state1','state2'], this.test1, this.action1);
		this.register(['state2','state3'], this.test2, this.action2);
	}

	run() {
		this.value('state1',true);
		this.value('state2',true);
	}

	test1() {
		console.log('Running Test #1..');
		if( this.value('state1') === true && this.value('state2') === true ) return true; else return false;
	}

	action1() {
		console.log('Running Action #1..');
		console.log('Condition 1 was true so setting up that condition 2 will also be true.');
		this.value('state3',true);
	}

	test2() {
		console.log('Running Test #2..');
		if( this.value('state2') === true && this.value('state3') === true ) return true; else return false;
	}

	action2() {
		console.log('Running Action #2..');
		console.log('Condition 2 was true so changing all states to false.');
		this.value('state1',false);
		this.value('state2',false);
		this.value('state3',false);
	}
}

let application = new Application();
application.run();



