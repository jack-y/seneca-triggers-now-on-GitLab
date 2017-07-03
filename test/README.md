![Logo]
> A [seneca.js][] triggers plugin.

# seneca-triggers: Hello World tests

Last update: 07/03/2017

## Run the tests

1. Open a command prompt
1. Go to this tests directory
1. Run `node test-notrigger.js && node test-before.js && node test-after.js && node test-before-after.js`

## Checking the results

### No trigger

The console shows:

	Triggers: test no trigger ----------------------
	Hello World!
	Test OK. result = {"msg":"Hello World!"}

This is the normal `helloWorld` action output.

### *Before* trigger only

The console shows:

	Triggers: test before ----------------------
	> First of all, my name is Jack.
	Hello Jack!
	Test OK. result = {"msg":"Hello Jack!","Set name":{"name":"Jack"}}

Before calling the `helloWorld` action, the *before* trigger is fired.
It outputs a message with a name from the configuration options.

Calling the `helloWorld` action, this name is retrieved.
The `helloWorld` output is changed accordingly.

The end result contains a new value: the name.

### *After* trigger only

The console shows:

	Triggers: test after ----------------------
	Hello World!
	# You said: "Hello World!".
	# How are you?
	Test OK. result = {"msg":"Hello World!"}

After calling the `helloWorld` action, the *after* trigger is fired.
It retrieves the result of the prior `helloWorld` action.
It outputs a message accordingly.

The end result remains unchanged.

### *Before* and *after* triggers

The console shows:

	Triggers: test before and after ----------------------
	> First of all, my name is Jack.
	Hello Jack!
	# You said: "Hello Jack!".
	# How are you?
	Test OK. result = {"msg":"Hello Jack!","Set name":{"name":"Jack"}}

Before calling the `helloWorld` action, the *before* trigger is fired.
It outputs a message with a name from the configuration options.

Calling the `helloWorld` action, this name is retrieved.
The `helloWorld` output is changed accordingly.

After calling the `helloWorld` action, the *after* trigger is fired.
It retrieves the result of the prior `helloWorld` action.
It outputs a message accordingly.

The end result contains a new value: the name.

# Contributing
The [Senecajs org][] encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

## License
Copyright (c) 2017, Richard Rodger and other contributors.
Licensed under [MIT][].

[MIT]: ./LICENSE
[Logo]: http://senecajs.org/files/assets/seneca-logo.jpg
[Seneca.js]: https://www.npmjs.com/package/seneca
[Seneca]: http://senecajs.org/
[Senecajs org]: https://github.com/senecajs/
