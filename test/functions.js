/* Copyright (c) 2017 e-soa Jacques Desodt */
'use strict'
const senecaTriggers = require('../seneca-triggers')

exports.timeout = 5000

exports.setSeneca = function (Seneca, triggers, fin, print) {
  return Seneca({ log: 'test' })
    // Activates unit test mode. Errors provide additional stack tracing context.
    // The fin callback is called when an error occurs anywhere.
    .test(fin, print)
    // Loads the microservice business logic
    .use(senecaTriggers, {
      triggers: triggers
    })
    .error(fin)
    .gate()
}

exports.helloWorld = function (args, done) {
  var name = args['Set name'] ? args['Set name'].name : 'World'
  var text = 'Hello ' + name + '!'
  console.log(text)
  return done(null, {success: true, here: 'prior', msg: text})
}

exports.helloWorldBad = function (args, done) {
  return done(null, {success: false, here: 'prior'})
}

exports.setName = function (args, done) {
  console.log('> First of all, my name is ' + args.name + '.')
  return done(null, {success: true, here: 'before', name: args.name})
}

exports.setNameBadResult = function (args, done) {
  console.log('> Something is rotten in this function :(')
  done(null, {success: false, errmsg: 'Something is rotten in this function'})
}

exports.question = function (args, done) {
  console.log('# You said: "' + args.priorResult.msg + '".')
  console.log('# ' + args.question)
  return done(null, {success: true, here: 'after', question: args.question})
}

exports.setActions = function (seneca) {
  seneca.add({role: 'test', cmd: 'helloworld'}, exports.helloWorld)
  seneca.add({role: 'test', cmd: 'helloworldbad'}, exports.helloWorldBad)
  seneca.add({role: 'test', cmd: 'setname'}, exports.setName)
  seneca.add({role: 'test', cmd: 'setnamebadresult'}, exports.setNameBadResult)
  seneca.add({role: 'test', cmd: 'question'}, exports.question)
}
