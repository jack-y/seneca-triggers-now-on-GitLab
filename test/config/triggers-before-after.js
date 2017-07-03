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
    },
    after: {
      pattern: 'role:test,cmd:question',
      options: {
        question: 'How are you?'
      }
    }
  }
]

// Exports configuration
module.exports = config
