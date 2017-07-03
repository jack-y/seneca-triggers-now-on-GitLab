/* Test triggers configuration file */
var config = {}

config.triggers = [
  {
    pattern: 'role:test,cmd:helloworld',
    after: {
      name: 'The question',
      pattern: 'role:test,cmd:question',
      options: {
        question: 'How are you?'
      }
    }
  }
]

// Exports configuration
module.exports = config
