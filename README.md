# feathers-joi
FeathersJS Service Hook Data Validation with Joi

# Installation
`npm i --save feathers-joi`

# Usage

```
const joi = require('joi')
const validate = require('feathers-joi')
const schema = joi.string().required()

// options.hookType needs to be defined for after hooks
const options = {
  stripUnknown: true,
  hookType: 'after'
}

// feathers app, configured with feathers-hooks
module.exports = app => {
  app.service('/route').hooks({
    before: {
      create: validate({ schema })
    },
    after: {
      create: validate({ schema, options })
    }
  })
}
```

default options = {
  hookType: 'before',
  stripUnknown: false
}