![Logo]
> A [seneca.js][] triggers plugin.

# seneca-triggers

Last update: 07/03/2017

## Description

This module is a plugin for the [Seneca][] framework. It provides *before* and *after* triggers management for any command.

## Why this plugin?

Thanks to the [Seneca][] framework, which already provides a full **action pattern override** technique: [priors][].
[Seneca][] plugins are fundamentally just a list of action [patterns][], and [patterns][] are *extensibles*. Then, your application can override [patterns][] with its own functionalities.

This plugin makes things easier. You simply declare the triggers objects. Each trigger is intended to fire a command *before* and/or *after* the prior command. Then, you implement these *before/after* commands with their pattern in the target microservices. Done!

## Benefits

### Logic included

All the logic of the triggers is included in this plugin. Just set it up.

### Retrieving results

The *before* command returns a result which can be retrieved by the prior command.
The prior command returns a result which can be retrieved by the *after* command.
The end result can include the *before* and/or *after* results in addition to the prior result.

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
  ... triggers array ...
})
```

The triggers array contains a list of **Trigger objects**.
As usual, the declaration of this list can be retrieved from a configuration file or directly written in the code.

**Caution: the triggers order significant!**
As this plugin use pattern override, please remember: in the same way that the order of plugin definition is significant, the order of pattern overrides is also [significant][].

### Trigger object

The pattern is:

```js
{
  pattern: 'role:the_prior_role,cmd:the_prior_command',
  before: {
    name: 'my_before_name',
    pattern: 'role:the_before_pattern,cmd:the_before_command',
      options: {
        aName: aValue,
        ...
    },
    result: true/false
  },
  after: {
    name: 'my_after_name',
    pattern: 'role:the_after_pattern,cmd:the_after_command',
      options: {
        aName: aValue,
        ...
    },
    result: true/false
  },
}
```

- **pattern**: the prior pattern to be overriden.
- **before**: the *before* trigger properties. See below.
- **after**: the *after* trigger properties. See below

## Applying triggers

# The *'hello World'* example

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