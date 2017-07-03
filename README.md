![Logo]
> A [seneca.js][] triggers plugin.

# seneca-triggers

Last update: 07/03/2017

## Description

This module is a plugin for the [Seneca][] framework. It provides *before* and *after* triggers management for any action.

## Why this plugin?

Thanks to the [Seneca][] framework, which already provides a full **action pattern override** technique: [priors][].
[Seneca][] plugins are fundamentally just a list of action [patterns][], and [patterns][] are *extensibles*. Then, your application can override [patterns][] with its own functionalities.

This plugin makes things easier. You simply declare the triggers objects. Each trigger is intended to fire an action *before* and/or *after* the prior action. Then, you implement these *before/after* actions with their pattern in the target microservices. Done!

## Benefits

### Logic included

All the logic of the triggers is included in this plugin. Just set it up.

### Retrieving results

- The *before* action returns a result which can be retrieved by the prior action.
- The prior action returns a result which can be retrieved by the *after* action.
- The end result can include the *before* and/or *after* results in addition to the prior result.

Enjoy it!

## Use case: entities

Almost all database engines offer [trigerring][] capabilities. Similarly, you can implement this feature with Seneca [entities][]. And then:

- automatically generate derived column values
- prevent invalid transactions
- enforce complex security authorizations
- enforce referential integrity across nodes in a distributed environment
- enforce complex business rules
- provide transparent event logging
- provide sophisticated auditing
- maintain synchronous table replicates
- gather statistics on table access
- ...

... and all the rest: we know that your imagination has no limit :)

# How it works

## Plugin declaration

Your application must declare this plugin use:

```js
seneca.use('seneca-triggers', {
  [ ... triggers array ... ]
})
```

The triggers array contains a list of **Trigger objects**.

**/!\ Caution: the triggers order is significant!**
As this plugin use pattern overrides, please remember: in the same way that the order of plugin definition is significant, the order of pattern overrides is also [significant][].

### Trigger object

The pattern is:

```js
{
  pattern: 'role:the_prior_role,cmd:the_prior_command, ...',
  resultname: 'prior_name',
  before: {
    pattern: 'role:the_before_pattern,cmd:the_before_command, ...',
    options: {
      aName: aValue,
      ...
    },
    resultname: 'my_before_name'
  },
  after: {
    pattern: 'role:the_after_pattern,cmd:the_after_command, ...',
    options: {
      aName: aValue,
      ...
    },
    resultname: 'my_after_name'
  },
}
```

- **pattern**: the prior pattern to be overriden.
- **resultname**: the name of the field containing the prior result in the out prior message. See the [Prior result](#prior-result) chapter below.
- **before**: this field is optional. It contains the *before* trigger properties. See below.
- **after**: this field is optional. It contains the *after* trigger properties. See below.

### Trigger properties

The pattern is:

```js
{
  pattern: 'role:the_trigger_pattern,cmd:the_trigger_command,...',
  options: {
    aName: aValue,
    ...
  },
  resultname: 'my_trigger_name'
}
```

- **pattern**: the pattern of the action that will be fired.
- **options**: this field is optional. If the trigger action needs additional data, they are declared in this object. This options object will be passed in the trigger action message.
- **resultname**: this field is optional. If set, this trigger result is to be included in the end result. The trigger result key name in the end result object is this *resultname* value.

## Applying triggers

After declaring triggers, they must be applied to benefit of the override feature. Please use this code in your main script:

```js
/* Please put your seneca.add() statements before these line. */
/* Applies triggers */
seneca.act({role: 'triggers', cmd: 'apply'}, (err, reply) => {
  if (err) { ... }
  /* Please put your main code here. */
})
/* Application end: seneca.close(...) */
```

This code must be inserted **immediatly after** all your `seneca.add()` statements. Remember: the pattern override order is significant.

The main code of your script, including its own `seneca.act ()` statements, must be inserted into the triggers `seneca.act` function as shown.

### Prior message

The prior message is **always transmitted** to the trigger action.
The trigger action function can use `args` retrieved from the prior message.

If your trigger action need **additional data**, it can be set in the trigger options configuration: 

```js
  options: {
    aName: aValue,
    ...
  }
```

### Prior result

The prior action result is passed as argument in the `args` array of the *after* trigger message. So the *after* action can eventually retrieve and use it. 
This argument name is set in the trigger configuration, in the main field `resultname`.

## And then...

That's all. Enjoy it!

# The *'hello World'* example

This (*very*) simple test shows the interaction between a *before* trigger, an *after* trigger and the prior action:

- If the *before* trigger is set, the output and the result of the prior action changes.
- If the *after* trigger is set, its action output displays the prior action result.

## Configuration

Here is the triggers configuration for this test:

```js
config.triggers = [
  {
    pattern: 'role:test,cmd:helloworld',
    resultname: 'priorResult',
    before: {
      pattern: 'role:test,cmd:setname',
      options: {
        name: 'Jack'
      },
      resultname: 'Set name'
    },
    after: {
      pattern: 'role:test,cmd:question',
      options: {
        question: 'How are you?'
      }
    }
  }
]
```

The *before* trigger adds its result to the end result, with the key `Set name`.
The *after* trigger leaves the end result unchanged.

## Actions

### The prior action

Declaration:

```js
seneca.add({role: 'test', cmd: 'helloworld'}, helloWorld)
```

Action:

```js
function helloWorld (args, done) {
  var name = args['Set name'] ? args['Set name'].name : 'World'
  var text = 'Hello ' + name + '!'
  console.log(text)
  done(null, {msg: text})
}
```

As usual, its output is:

	Hello World!

### The *before* trigger

Declaration:

```js
seneca.add({role: 'test', cmd: 'setname'}, setName)
```

Action:

```js
function setName (args, done) {
  console.log('> First of all, my name is ' + args.name + '.')
  done(null, {name: args.name})
}
```

The trigger configuration contains a `name` property. For example: `name: 'Jack'`. Depending on this property, its output is:

	> First of all, my name is Jack.

Then, the name value is passed as argument to the prior message. The prior action retrieves this name value. The prior output changes accordingly:

	Hello Jack!

### The *after* trigger

Declaration:

```js
seneca.add({role: 'test', cmd: 'question'}, question)
```

Action:

```js
function question (args, done) {
  console.log('# You said: "' + args.priorResult.msg + '".')
  console.log('# ' + args.question)
  done(null, {question: args.question})
}
```

As set, the prior result has been saved in the `priorResult` argument. Depending on this argument, the trigger output is:

	# You said: "Hello World!".
	# How are you?

And if the *before* trigger is also set, it becomes:

	# You said: "Hello Jack!".
	# How are you?

### The end result

The prior end result is:

```js
{"msg":"Hello World!"}
```

If the *before* trigger is set, the end result changes:

```js
{"msg":"Hello Jack!","Set name":{"name":"Jack"}}
```

## Run the tests

The `test` directory contains the full *hello World* sources. The 4 scenarios can be tested:

- no trigger
- *before* trigger only
- *after* trigger only
- *before* and *after* triggers

The outputs can be checked [here][].

To run these tests:

```sh
node ./test/test-notrigger.js && node ./test/test-before.js && node ./test/test-after.js && node ./test/test-before-after.js
```

# Install

To install, simply use npm:

```sh
npm install seneca-triggers
```

# Test

The `test` directory contains the full *helloWorld* sources.
To run these tests:

```sh
node ./test/test-notrigger.js && node ./test/test-before.js && node ./test/test-after.js && node ./test/test-before-after.js
```

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
[priors]: http://senecajs.org/docs/tutorials/understanding-prior-actions.html
[Patterns]: http://senecajs.org/getting-started/#patterns
[patterns]: http://senecajs.org/getting-started/#patterns
[entities]: http://senecajs.org/docs/tutorials/understanding-data-entities.html
[trigerring]: https://en.wikipedia.org/wiki/Database_trigger
[significant]: http://senecajs.org/docs/tutorials/understanding-prior-actions.html#add-order-is-significant-
[here]: https://github.com/jack-y/seneca-triggers/blob/master/test/README.md
