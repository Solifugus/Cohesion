
# Cohesion

Cohesion is a JavaScript class useful to resynchronize after multiple asynchronous calls and/or to code stateful condition-driven programs.

# License

MIT License -- see included LICENSE file.

# Theory

The Cohesion class is extremely simple but the theory behind its use can be very powerful.  The goal of simplifying code is shared between either using Cohesion to resynchronize after multiple asynchronous calls or to code stateful condition-driven programs.  However, stateful condition-driven programming can also be used in a way that eliminates the possibility of software bugs (in thoery).

## Resynchronizing after Multiple Asynchronous Calls

The problem is that making multiple asynchronous calls that are prerequisite to a common process yields you with being in different places in the code under different variable scopes.  Promises can simply this a little but not fully solve the problem.  Using global variable scope and a common callback is ugly and imperfect, as it yields the potential for variable scope collisions, renders re-entrance and recursion difficult, and there is no way to know from which asynchronous call you have returned in the shared callback function.

The solution is to have your callback use Cohesion to set values.  These values may be used to collect between multiple asynchronous calls.  And each time you change a value, the test associated with it will be run.  If that test returns true, the associated action will run.  The idea is that you make the test return true when all required values are set, indicating all required asynchronous calls have finished successfully.  If there is a special condition, such as one asynchronous call failing then the test may also set another value to indicate that and then run true, expecting the action to notice the indicated failure and act accordingly. 

Note that while useful, synchronous calls are not necessary to use Cohesion.  You can also modify values from anywhere at any time to trigger appropriate actions.  

## Stateful Condition-Driven Programming

Stateful Condition-Driven programming is where you design your software on sets of conditions that trigger the setting of other conditions.  The advantageous of this are three-fold: 

1. Handing asynchrony

This is a described in the previous section.

2. Handling of events appropriately whether forseen or unforseen

When you setup conditions underwhich a particular action should occur then it doesn't matter what causes those conditions.  So the only thing you need to consider is, under what conditions should a particular action be taken.  Of course, an action may then modify other conditions.  So if when and appropriate, it should trigger actions that should be trigger -- whether or not you even considered the possibility.

3. The impossibility of software bugs

Syntax errors, mechanical errors, and erroneous requirements are always possible.  Furthermore, one has no control over the bugs in dependent tools and packages used.  However, where your code consists purely of tests of state conditions executing Actions that only set other states then there is no room for bugs. 

Looping and all the same kinds of processes can be coded statefully as in procedural software.  The fundamental difference is that procedural software continuously enforces the one conditional one every command that the command just previous to it, first be executed.  And that condition is the cause of software bugs.

# Example

The included "Application.js" file provides a quick and simple example. 
The steps are:

1. Inherit from Cohesion.
2. Register your reactions with the "setReaction( name, test, action )" method.   
  - name: string uniquely identifying the reaction
  - test: function returning true, if conditions are right to execute the reaction
  - action: code to execute, if triggered and the test returns true
3. Register your triggers with the "setTrigger( variables, reaction )" method.  
  - varialbes: array of strings, each being the name of a variable that, if written to, triggers reaction(s)
  - reaction: string identifying the reaction that the variables are to trigger
4. Write to trigger variables using the "trigger( name, value )" method.
  - name: string identifying the variable
  - value: any JavaScript data type to be held under the variable name, except that undefined (or ommitted) means this is a read, not write, operation

The idea is that you can create multiple reactions and multiple variables that, when written to, can trigger them.
A reaction comprises a test and an action.  The test is to determine if conditions are right to execute the action.
The action is to do whatever, including setting trigger values that could cause other reactions to occur (a chain reaction).
Reactions are named so that can be re-used.  You can setup any number of reactions and any number of triggers to initiate any one or more of the reactions.



## Prerequisites

None.


# Roadmap

The concept is pretty simple and doesn't need more than the Cohesion class, as it is.  However, I could build more validation to improve the quality of that class with better and more instructional error messages.  I am also thinking that more specific examples could be enlightening.

One idea I am pondering is to build a simple programming language on top of this for a perfectly synchronous view of business logic, even as all operations behind the scenes are truly and fully asynchronous.  I would likely build this on top of MySQL, making heavy use of MySQL's JSON features (NoSQL amid SQL).

I am aware of no business language being devised since COBOL.  This language would have the same overall goals but with a modernized architecture. 

Again note that the following is currently just in the stage of thinking.

## Architecture

Software would comprise of services in a decentralized mesh.  Each service would be requested by another service, designating its input source, its control parameters, and its output destination.  In turn, this could instantiate an instance of that service controlled by the requesting service. 

Also, each service would advertise what it offers and what it seeks, of other services.  Services offered may be contingent upon services sought.  Non-hosting services run within hosting services.  A hosting service runs on a computer operating system.  Non-hosting services each run in a container provided by the hosting service.  So I hosting service's job is to provide general network access, memory, and processing plus any addition resource options, such as a user interface (if available). 

Services both offered and sought are advertised with a hosting service's "master service".  A master service controls routing of communication through the mesh, as well as the import/export of services between hosting services in the mesh.  

## The Business Language

The Cohesion approach will handle the asychrony efficiently as well as unexpected circumstanes.. 

The I/O and control streams will transport JSON formatted data so the Business Language can percceive mixed tree and array structures of data.  It's operations being stateful will have control data, input data, and memory data to base a logical conditions on.  It will have memory data, and output data to write to, upon a truth condition.

e.g.

(control.operation = add, input.x is number, and input.y is number) => {output.result = input.x + input.y}


