/* Copyright (c) 2017 e-soa Jacques Desodt */
'use strict'

/* Default plugin options */
const pluginName = 'seneca-triggers'
const senecaTriggers = require('../' + pluginName)
/* Node modules */
const testTriggers = require('./config/triggers-before')
const functions = require('./test-functions')
const promise = require('bluebird')
const seneca = require('seneca')()
// .act() method as promise; to learn more about this technique see:
// http://bluebirdjs.com/docs/features.html#promisification-on-steroids
const act = promise.promisify(seneca.act, {context: seneca})
/* Initializations */
seneca
  .use(senecaTriggers, {
    triggers: testTriggers.triggers
  })
seneca.ready(function (err) {
  if (err) { throw err }
  /* Begins */
  console.log('Triggers: test before ----------------------')
  /* Actions */
  seneca.add({role: 'test', cmd: 'helloworld'}, functions.helloWorld)
  seneca.add({role: 'test', cmd: 'setname'}, functions.setName)
  seneca.add({role: 'test', cmd: 'question'}, functions.question)
  /* Adds triggers */
  act({role: 'triggers', cmd: 'apply'})
  .then(function (result) {
    /* Main: run tests */
    act({role: 'test', cmd: 'helloworld'})
    .then(function (result) {
      console.log('Test OK. result =', JSON.stringify(result))
    })
  })
  /* Ends seneca */
  seneca.close((err) => {
    if (err) { console.log(err) }
  })
})
