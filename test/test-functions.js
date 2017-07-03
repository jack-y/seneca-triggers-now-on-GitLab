/* Copyright (c) 2017 e-soa Jacques Desodt */
'use strict'

exports.helloWorld = function (args, done) {
  var name = 'World'
  if (args['Set name']) {
    name = args['Set name'].name
  }
  var text = 'Hello ' + name + '!'
  console.log(text)
  done(null, {msg: text})
}

exports.setName = function (args, done) {
  console.log('> First of all, my name is ' + args.name + '.')
  done(null, {name: args.name})
}

exports.question = function (args, done) {
  console.log('# You said: "' + args.priorResult.msg + '".')
  console.log('# ' + args.question)
  done(null, {question: args.question})
}
