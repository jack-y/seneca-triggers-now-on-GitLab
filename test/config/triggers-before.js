/* Test triggers configuration file */
var config = {}

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
    }
  }
]

// Exports configuration
module.exports = config
