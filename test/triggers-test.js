/* Copyright (c) 2017 e-soa Jacques Desodt, MIT License */
'use strict'

/* Prerequisites */
const Seneca = require('seneca') // eslint-disable-line no-unused-vars
const testFunctions = require('./functions')
const triggersConfig = require('./triggers-config')

/* Test prerequisites */
const Code = require('code')
const Lab = require('lab', {timeout: testFunctions.timeout})
var lab = (exports.lab = Lab.script())
var describe = lab.describe
var it = lab.it
var expect = Code.expect

describe('triggers', function () {
  //
  // Simple
  it('no trigger', function (fin) {
    console.log('-- No trigger --------------------')
    // Gets the Seneca instance
    var seneca = testFunctions.setSeneca(Seneca, triggersConfig.notrigger, fin) // Add 'print' for debug
    /* Actions */
    testFunctions.setActions(seneca)
    /* Applies triggers */
    seneca.act({role: 'triggers', cmd: 'apply'}, function (ignore, result) {
      /* Main: run tests */
      seneca.act({role: 'test', cmd: 'helloworld'}, function (ignore, result) {
        expect(result.success).to.equal(true)
        expect(result.here).to.equal('prior')
        expect(result['Set name']).to.not.exist()
        fin()
      })
    })
  })

  // Before
  it('before', function (fin) {
    console.log('-- Before --------------------')
    // Gets the Seneca instance
    var seneca = testFunctions.setSeneca(Seneca, triggersConfig.before, fin) // Add 'print' for debug
    testFunctions.setActions(seneca)
    /* Applies triggers */
    seneca.act({role: 'triggers', cmd: 'apply'}, function (ignore, result) {
      /* Main: run tests */
      seneca.act({role: 'test', cmd: 'helloworld'}, function (ignore, result) {
        expect(result.success).to.equal(true)
        expect(result.here).to.equal('prior')
        expect(result['Set name'].name).to.equal('Jack')
        fin()
      })
    })
  })

  // Before with bad result
  it('before with bad result', function (fin) {
    console.log('-- Before with bad result--------------------')
    // Gets the Seneca instance
    var seneca = testFunctions.setSeneca(Seneca, triggersConfig.beforebad, fin) // Add 'print' for debug
    testFunctions.setActions(seneca)
    /* Applies triggers */
    seneca.act({role: 'triggers', cmd: 'apply'}, function (ignore, result) {
      /* Main: run tests */
      seneca.act({role: 'test', cmd: 'helloworld'}, function (ignore, result) {
        expect(result.success).to.equal(false)
        expect(result.here).to.not.exist()
        expect(result.errmsg).to.exist()
        expect(result.trigger.options.name).to.equal('Jack')
        fin()
      })
    })
  })

  // After
  it('after', function (fin) {
    console.log('-- After --------------------')
    // Gets the Seneca instance
    var seneca = testFunctions.setSeneca(Seneca, triggersConfig.after, fin) // Add 'print' for debug
    testFunctions.setActions(seneca)
    /* Applies triggers */
    seneca.act({role: 'triggers', cmd: 'apply'}, function (ignore, result) {
      /* Main: run tests */
      seneca.act({role: 'test', cmd: 'helloworld'}, function (ignore, result) {
        expect(result.success).to.equal(true)
        expect(result.here).to.equal('prior')
        expect(result['Set name']).to.not.exist()
        expect(result.question).to.not.exist()
        fin()
      })
    })
  })

  // Before & after
  it('before & after', function (fin) {
    console.log('-- Before & after --------------------')
    // Gets the Seneca instance
    var seneca = testFunctions.setSeneca(Seneca, triggersConfig.beforeafter, fin) // Add 'print' for debug
    testFunctions.setActions(seneca)
    /* Applies triggers */
    seneca.act({role: 'triggers', cmd: 'apply'}, function (ignore, result) {
      /* Main: run tests */
      seneca.act({role: 'test', cmd: 'helloworld'}, function (ignore, result) {
        expect(result.success).to.equal(true)
        expect(result.here).to.equal('prior')
        expect(result['Set name'].name).to.equal('Jack')
        expect(result.question).to.not.exist()
        fin()
      })
    })
  })

  // Before & after with bad prior
  it('before & after with bad prior', function (fin) {
    console.log('-- Before & after with bad prior --------------------')
    // Gets the Seneca instance
    var seneca = testFunctions.setSeneca(Seneca, triggersConfig.beforeafterbad, fin) // Add 'print' for debug
    testFunctions.setActions(seneca)
    /* Applies triggers */
    seneca.act({role: 'triggers', cmd: 'apply'}, function (ignore, result) {
      /* Main: run tests */
      seneca.act({role: 'test', cmd: 'helloworldbad'}, function (ignore, result) {
        expect(result.success).to.equal(false)
        expect(result.here).to.equal('prior')
        fin()
      })
    })
  })
  //
})
