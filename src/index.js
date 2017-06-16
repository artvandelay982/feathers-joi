const joi = require('joi');

// default options
const defaultOptions = {
    hookType: 'before',
    stripUnknown: false
}
// feathersjs joi schema validator hooks
// db agnostic - wow!
const feathersJoi = module.exports = ({ schema, options = {} }) => {
    return validate(schema, options)
}


function validate (schema, options) {
    return (hook) => { // returns a feathers hook with schema context
        return new Promise((resolve, reject) => {
            let { hookType, stripUnknown } = options
            
            // if hookType is undefined then set it as defaultOptions.hookType
            hookType = (hookType !== undefined ? hookType : defaultOptions.hookType)

            // if stripUnknown is undefined then set as defaultOptions.stripUnknown 
            stripUnknown = (stripUnknown !== undefined ? stripUnknown : defaultOptions.stripUnknown)

            // picking hook.data or hook.result based on hookType
            const typeKey = (hookType === 'before' ? 'data' : 'result')
    
            const result = joi.validate(hook[typeKey], schema, { stripUnknown })
            
            if (result.error) { // bad input data, reject
                return reject(result.error)
            }
            hook[typeKey] = result.value; // do this in case any type coersion has been performed
            resolve(hook);
        });
    };
}
