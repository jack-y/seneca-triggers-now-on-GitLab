/* Test triggers configuration file */
var config = {}

config.notrigger = []

config.before = [
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

config.beforebad = [
  {
    pattern: 'role:test,cmd:helloworld',
    resultname: 'priorResult',
    before: {
      pattern: 'role:test,cmd:setnamebadresult',
      options: {
        name: 'Jack'
      },
      resultname: 'Set name'
    }
  }
]

config.after = [
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

config.beforeafter = [
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

config.beforeafterbad = [
  {
    pattern: 'role:test,cmd:helloworldbad',
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
