/* Copyright (c) 2016-2017 e-soa Jacques Desodt */
'use strict'

/* Default plugin options */
const pluginName = 'seneca-triggers'
const config = require('./config/' + pluginName + '.js')

/* Prerequisites */
const promise = require('bluebird')

/* Plugin begins */
module.exports = function (options) {
  /* Initializations */
  const seneca = this
  seneca.log.debug('Loading plugin:', seneca.context.full)
  seneca.log.debug('Default options:', config)
  seneca.log.debug('User options:', options)

  /* Merge default options with options passed in seneca.use('plugin', options) */
  options = seneca.util.deepextend(config, options)
  seneca.log.debug('Options:', options)

  /* --------------- ACTIONS --------------- */

  seneca.add({role: 'triggers', cmd: 'apply'}, applyTriggers)

  /* --------------- FUNCTIONS --------------- */

  /* Applies all trigers */
  function applyTriggers (args, done) {
    // Gets the triggers array
    var triggers = args.triggers ? args.triggers : options.triggers
    // Checks if the array is not empty
    if (triggers && triggers.length > 0) {
      // Loops on each trigger
      var cmds = []
      triggers.forEach(function (aTrigger) {
        let command = applyOneTrigger(aTrigger)
        cmds.push(command)
      })
      // Executes the commands
      promise.all(cmds)
      .then(function (results) {
        // Returns success
        return done(null, {success: true, results: results})
      })
    }
    done(null, {success: true})
  }

  /* Applies one trigger */
  function applyOneTrigger (aTrigger) {
    return new Promise(function (resolve, reject) {
      // Overrides the prior pattern
      seneca.add(aTrigger.pattern, function (msg, reply) {
        var senecaHere = this // Must be declared here for prior action.
        applyTriggerBefore(aTrigger, msg)
        .then(function (beforeResult) {
          runPrior(senecaHere, msg)
          .then(function (priorResult) {
            applyTriggerAfter(aTrigger, msg, priorResult)
            .then(function (priorResult) {
              if (beforeResult) {
                // Adds the before-result to the prior result
                addResults(aTrigger, beforeResult, null, priorResult)
              }
              // Final response
              reply(null, priorResult)
            })
            .catch(function (err) { reply(err) })
          })
          .catch(function (err) { reply(err) })
        })
        .catch(function (err) { reply(err) })
      })
    })
  }

  function applyTriggerBefore (aTrigger, msg) {
    return new Promise(function (resolve, reject) {
      // Checks if there is a trigger-before
      if (aTrigger.before) {
        // Fires the trigger-before
        execTrigger(aTrigger.before, msg)
        .then(function (beforeResult) {
          // Adds the before-result to the prior message
          // This result could be used by the prior command
          addResults(aTrigger, beforeResult, null, msg)
          return resolve(beforeResult)
        })
        .catch(function (err) { return reject(err) })
      } else {
        return resolve(null)
      }
    })
  }

  function runPrior (senecaHere, msg) {
    return new Promise(function (resolve, reject) {
      senecaHere.prior(msg, function (err, result) {
        if (err) { return reject(err) }
        return resolve(result)
      })
    })
  }

  function applyTriggerAfter (aTrigger, msg, priorResult) {
    return new Promise(function (resolve, reject) {
      // Checks if there is a trigger-after
      if (aTrigger.after) {
        // Adds the prior result to the prior message
        // This result could be used by the after-function
        msg.options = msg.options ? msg.options : {}
        msg.options['priorResult'] = priorResult
        // Fires the trigger-after
        execTrigger(aTrigger.after, msg)
        .then(function (afterResult) {
          // Adds the after-result to the prior result
          addResults(aTrigger, null, afterResult, priorResult)
          return resolve(priorResult)
        })
        .catch(function (err) { return reject(err) })
      } else {
        return resolve(priorResult)
      }
    })
  }

  function execTrigger (aTriggerObject, msg) {
    return new Promise(function (resolve, reject) {
      var options = aTriggerObject.options ? aTriggerObject.options : {}
      Object.assign(options, msg.options)
      seneca.act(aTriggerObject.pattern, options, function (err, result) {
        if (err) { return reject(err) }
        return resolve(result)
      })
    })
  }

  function addResults (aTrigger, resultBefore, resultAfter, result) {
    if (aTrigger.before && aTrigger.before.result && resultBefore && result) {
      result[aTrigger.before.name] = resultBefore
    }
    if (aTrigger.after && aTrigger.after.result && resultAfter && result) {
      result[aTrigger.after.name] = resultAfter
    }
  }

  /* plugin ends */
  return {
    name: pluginName
  }
}
