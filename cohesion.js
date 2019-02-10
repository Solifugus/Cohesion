
// Cohesion
// LICENSE: MIT (See included LICENSE file)
// Purpose: to resynchronize multiple asynchronous calls and/or setup statefully designed processes

class Cohesion {
	constructor( debug = false ) {
		this.debug     = debug;
		this.triggers  = {};  // named trigger variables each hold: { value:..anything.., reactions:[..array of reaction names..] } 
		this.reactions = {};  // each named condition objects: { test:{}, action:{}, orphaned:false }
	}

	// Put Trigger connection to condition
	setTrigger( triggerNames, reactionName ) {
		if( !Array.isArray(triggerNames) ) triggerNames = [triggerNames];
		reactionName = reactionName.trim();
		for( let t = 0; t < triggerNames.length; t += 1 ) {

			// Ensure we set the trigger
			var triggerName = triggerNames[t].trim();
			if( this.triggers[triggerName] === undefined ) this.triggers[triggerName] = { reactions:[] };
	
			// Ensure we set the condition under the trigger 
			var trigger = this.triggers[triggerName];
			if( trigger.reactions.indexOf(reactionName) === -1 ) trigger.reactions.push(reactionName);
			if( this.reactions[reactionName] === undefined ) this.reactions[reactionName] = {}; 
			this.reactions[reactionName].orphaned = false;
		}
	}

	// Remove Specified Trigger(s) and Orphaned Conditions, if any..
	unsetTrigger( triggerNames, removeConditions = true ) {
		if( !Array.isArray(triggerNames) ) triggerNames = [triggerNames];
		var reactionNames = [];  // to record reactions under removed trigger(s)
		for( let t = 0; t < triggerNames.length; t += 1 ) {
			let trigger = this.triggers[triggerName];
			if( trigger !== undefined ) {

				// Record names of reactions under trigger
				for( let c = 0; c < trigger.reactions.length; c += 1 ) {
					if( reactionNames.indexOf( trigger.reactions[t] ) !== -1 ) reactionNames.push( trigger.reactions[t] );
				}

				// Eliminate trigger
				this.triggers[triggerNames[t]] = undefined;
			}
		}
	
		// Find orphaned reactions and remove them (by default)
		if( removeConditions ) {
			for( var c = 0; c < reactionNames.length; c += 1 ) {
				var orphaned = true;
				for( let t = 0; t < triggerNames.length; t += 1 ) {
					let trigger = this.triggers[triggerName];
					if( this.triggers[triggerName].reactions.indexOf() !== -1 ) {
						orphaned = false;
						break;
					}
				}

				// Condition is orphaned, so remove it
				if( orphaned ) this.reactions[reactionNames[c]] = undefined;
			}
		}
	}

	// Put named condition, specifying the test and action functions
	setReaction( name, test, action ) {
		if( !this.isFunction(test) )   throw 'Cohesion Failure -- test specified in setReaction() needs to be a function';
		if( !this.isFunction(action) ) throw 'Cohesion Failure -- action specified in setReaction() needs to be a function';

		name = name.trim();
		if( this.reactions[name] === undefined ) this.reactions[name] = { orphaned:true }
		let reaction = this.reactions[name];
		reaction.test   = test;
		reaction.action = action;
	}

	unsetReaction( name ) {
		name = name.trim();

		// Remove all trigger references to the condition
		for( let triggerName in this.triggers ) {
			let conditionIndex = this.triggers[triggerName].reactions.indexOf(name);
			if( conditionIndex !== -1 ) this.triggers[triggerName].reactions.slice(conditionIndex,1);
		}

		// Remove the condition
		this.reactions[name] = undefined;
	}

	// Get or Set Specified Trigger Value -- if set and test is true then run associated action
	trigger( name, value ) {
		name = name.trim();
		var trigger = this.triggers[name];
		if( trigger === undefined ) throw 'Cohesion Failure -- referenced trigger does not exist: ' + JSON.stringify(name) + '.';
		for( let r = 0; r < trigger.reactions.length; r += 1 ) {
			let reaction = this.reactions[trigger.reactions[r]];
			
			if( value === undefined ) {
				//console.log( 'Requested to read "' + name + '", which is ' + JSON.stringify(trigger.value) );
				return trigger.value;
				}
			else {
				//console.log( 'Requested to assign "' + name + '" to ' + JSON.stringify(value) );
				trigger.value = value;

				// On test, run action..
				if( reaction.test !== undefined && reaction.action !== undefined ) {
					if( reaction.test.bind(this)() ) reaction.action.bind(this)();
				}
			}
		}
	}

	isFunction( checking ) {
 		return checking && {}.toString.call(checking) === '[object Function]';
	}


} // end of Cohesion class

exports.Cohesion = Cohesion;

