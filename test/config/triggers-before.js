/* Test triggers configuration file */
var config = {}

config.triggers = [
  {
    pattern: 'role:test,cmd:helloworld',
    before: {
      name: 'Set name',
      pattern: 'role:test,cmd:setname',
      options: {
        name: 'Jack'
      },
      result: true
    }
  }
]

// Exports configuration
module.exports = config
