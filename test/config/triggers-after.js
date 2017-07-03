/* Test triggers configuration file */
var config = {}

config.triggers = [
  {
    pattern: 'role:test,cmd:helloworld',
    resultname: 'priorResult',
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
