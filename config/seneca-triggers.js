/* microservice configuration file */
var config = {}
/**
 * For more informations on entities and patterns, see:
 * https://github.com/senecajs/seneca-entity
 * http://senecajs.org/getting-started/#patterns
 * http://senecajs.org/docs/tutorials/understanding-prior-actions.html
 */

/**
 * The triggers array pattern.
 * WARNING: this plugin use pattern overrides,
 * so the items ORDER IS IMPORTANT !!!
 * (as the patterns order is important)
 * See: http://senecajs.org/docs/tutorials/understanding-prior-actions.html#add-order-is-significant-
 *
 * Example:
 *
 config.triggers = [
   {
     pattern: 'role:test,cmd:helloworld',
     before: {
       name: 'Set name',
       pattern: 'role:test,cmd:setname',
       options: {
         name: 'Jack'
       },
       result: true
     },
     after: {
       name: 'The question',
       pattern: 'role:test,cmd:question',
       options: {
         question: 'How are you?'
       }
     }
   }
 ]
 *
**/

// The triggers array.
config.triggers = []

// Exports configuration
module.exports = config
