const joi = require('joi');

// feathersjs joi schema validator hooks
// db agnostic - wow!
const feathersJoi = module.exports = options => {
    // only options.schema is supported
    return validate(options.schema);
};

function validate (schema) {
    return (hook) => { // returns a feathers hook with schema context
        return new Promise((resolve, reject) => {
            const result = joi.validate(hook.data, schema);
            if (result.error) { // bad input data, reject
                return reject(result.error);
            }
            hook.data = result.value; // do this in case any type coersion has been performed
            resolve(hook);
        });
    };
}
