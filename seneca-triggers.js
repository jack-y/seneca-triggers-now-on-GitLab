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

  /* Applies all triggers */
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
        runBeforeTrigger(aTrigger, msg)
        .then(function (beforeResult) {
          // Checks if before-trigger successes
          if (beforeResult.success) {
            runPrior(senecaHere, msg)
            .then(function (priorResult) {
              runAfterTrigger(aTrigger, msg, priorResult)
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
          } else {
            // Before-trigger unsuccess
            // Adds the trigger to the result before reply
            beforeResult.trigger = aTrigger.before
            reply(null, beforeResult)
          }
        })
        .catch(function (err) { reply(err) })
      })
    })
  }

  /* Runs the before-trigger action */
  function runBeforeTrigger (aTrigger, msg) {
    return new Promise(function (resolve, reject) {
      // Checks if there is a before-trigger
      if (aTrigger.before) {
        // Fires the before-trigger
        execTrigger(aTrigger.before, msg)
        .then(function (beforeResult) {
          // Checks if the result success property exists. Default = true.
          if (!beforeResult.hasOwnProperty('success')) {
            beforeResult.success = true
          }
          // Adds the before-result to the prior message
          // This result could be retrieved by the prior action
          addResults(aTrigger, beforeResult, null, msg)
          return resolve(beforeResult)
        })
        .catch(function (err) { return reject(err) })
      } else {
        // No before-trigger
        return resolve({success: true})
      }
    })
  }

  /* Runs the prior action */
  function runPrior (senecaHere, msg) {
    return new Promise(function (resolve, reject) {
      senecaHere.prior(msg, function (err, result) {
        if (err) { return reject(err) }
        return resolve(result)
      })
    })
  }

  /* Runs the after-trigger action */
  function runAfterTrigger (aTrigger, msg, priorResult) {
    return new Promise(function (resolve, reject) {
      // Checks if there is a after-trigger
      if (aTrigger.after) {
        // Adds the prior result to the prior message
        // This result could be retrieved by the after-action
        msg[aTrigger.resultname] = priorResult
        // Fires the after-trigger
        execTrigger(aTrigger.after, msg)
        .then(function (afterResult) {
          // Adds the after-result to the prior result
          addResults(aTrigger, null, afterResult, priorResult)
          return resolve(priorResult)
        })
        .catch(function (err) { return reject(err) })
      } else {
        // No after-trigger
        return resolve(priorResult)
      }
    })
  }

  function execTrigger (aTriggerObject, msg) {
    return new Promise(function (resolve, reject) {
      // Adds trigger options to the message data
      var options = aTriggerObject.options ? aTriggerObject.options : {}
      var data = seneca.util.clean(msg)
      Object.assign(data, options)
      // Action with message data (lower preference)
      seneca.act(aTriggerObject.pattern, data, function (err, result) {
        if (err) { return reject(err) }
        return resolve(result)
      })
    })
  }

  function addResults (aTrigger, resultBefore, resultAfter, result) {
    if (aTrigger.before && aTrigger.before.resultname && resultBefore && result) {
      result[aTrigger.before.resultname] = resultBefore
    }
    if (aTrigger.after && aTrigger.after.resultname && resultAfter && result) {
      result[aTrigger.after.resultname] = resultAfter
    }
  }

  /* plugin ends */
  return {
    name: pluginName
  }
}
