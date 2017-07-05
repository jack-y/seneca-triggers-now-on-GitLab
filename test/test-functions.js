/* Copyright (c) 2017 e-soa Jacques Desodt */
'use strict'

exports.helloWorld = function (args, done) {
  var name = args['Set name'] ? args['Set name'].name : 'World'
  var text = 'Hello ' + name + '!'
  console.log(text)
  done(null, {msg: text})
}

exports.setName = function (args, done) {
  console.log('> First of all, my name is ' + args.name + '.')
  done(null, {name: args.name})
}

exports.setNameBadResult = function (args, done) {
  console.log('> Something is rotten in this function :(')
  done(null, {success: false, errmsg: 'Something is rotten in this function'})
}

exports.question = function (args, done) {
  console.log('# You said: "' + args.priorResult.msg + '".')
  console.log('# ' + args.question)
  done(null, {question: args.question})
}
