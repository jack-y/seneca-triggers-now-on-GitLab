![Logo]
> A [seneca.js][] triggers plugin.

# seneca-triggers: Hello World tests

Last update: 07/07/2017

## Run the tests

1. Open a command prompt
1. Go to the plugin directory
1. Run `npm test`

## Checking the results

### No trigger

The console shows:

	-- No trigger --------------------
	Hello World!

This is the normal `helloWorld` action output.

### *Before* trigger only

The console shows:

	-- Before --------------------
	> First of all, my name is Jack.
	Hello Jack!

Before calling the `helloWorld` action, the *before* trigger is fired.
It outputs a message with a name from the configuration options.

Calling the `helloWorld` action, this name is retrieved.
The `helloWorld` output is changed accordingly.

The end result contains a new value: the name.

### *Before* trigger with bad result

The console shows:

	-- Before with bad result--------------------
	> Something is rotten in this function :(

Before calling the `helloWorld` action, the *before* trigger is fired.
The override process is stopped because of the bad result of the trigger.

The end result is the *before* result.

### *After* trigger only

The console shows:

	-- After --------------------
	Hello World!
	# You said: "Hello World!".
	# How are you?

After calling the `helloWorld` action, the *after* trigger is fired.
It retrieves the result of the prior `helloWorld` action.
It outputs a message accordingly.

The end result remains unchanged.

### *Before* and *after* triggers

The console shows:

	-- Before & after --------------------
	> First of all, my name is Jack.
	Hello Jack!
	# You said: "Hello Jack!".
	# How are you?

Before calling the `helloWorld` action, the *before* trigger is fired.
It outputs a message with a name from the configuration options.

Calling the `helloWorld` action, this name is retrieved.
The `helloWorld` output is changed accordingly.

After calling the `helloWorld` action, the *after* trigger is fired.
It retrieves the result of the prior `helloWorld` action.
It outputs a message accordingly.

The end result contains a new value: the name.

### *Before* and *after* triggers with bad prior

The console shows:

	-- Before & after with bad prior --------------------
	> First of all, my name is Jack.

Before calling the `helloWorld` action, the *before* trigger is fired.
It outputs a message with a name from the configuration options.

Calling the bad `helloWorld` action, its result contains `success: false`.
The override process is stopped.
The *after* trigger is not fired.

The end result contains the prior bad result.

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
