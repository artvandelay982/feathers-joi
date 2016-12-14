const feathers = require('feathers');
const feathersJoi = require('../src');
const memory = require('feathers-memory');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const handler = require('feathers-errors/handler');
const bodyParser = require('body-parser');
const serveStatic = require('feathers').static;
const path = require('path');
const joi = require('joi');

// Create a feathers instance.
const app = feathers()
  // Enable Hooks
  .configure(hooks())
  // Enable Socket.io
  .configure(socketio())
  // Enable REST services
  .configure(rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({extended: true}))
  // Serve static files
  .use('/', serveStatic( path.join(__dirname, 'public') ));


const start = new Promise(function(resolve) {
  // Register a Feathers in-memory service
  app.use('/messages', memory({
    paginate: {
      default: 2,
      max: 4
    }
  }));

  const messages = app.service('/messages');
  messages.before({
    // add a feathersJoi validation hook with a joi schema
    create: [ feathersJoi({
      schema: joi.object().keys({
        text: joi.string().required()
      })
    }) ]
  })

  // A basic error handler, just like Express
  app.use(handler());

  // Start the server
  var server = app.listen(3030);
  server.on('listening', function() {
    console.log('Feathers Joi Validation Service running on http://127.0.0.1:3030/');
    resolve(server);
  });
}).catch(function(error){
  console.error(error);
});

module.exports = start;
