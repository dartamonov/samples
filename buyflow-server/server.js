// node includes
var path = require('path');

// vendor includes
var express = require('express');
var bodyParser = require('body-parser');

/**
 * Create Express server.
 */
const app = express();

/**
 * Controllers (route handlers).
 */
const videoController = require('./mock_server/controllers/video');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// Enable cross-origin resource sharing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// USE THIS FOR MOCK DELAY
// app.use(function (req, res, next) {
//   setTimeout(function() {
//     next();
//   }, 3000);
// });

app.get('/', function (req, res) {
  res.send('Welcome to the mocking service');
});

//VIDEO
app.get('/api/video/channels', videoController.index); // GET
app.post('/api/video/channels-add/:channelType/:productId', videoController.addChannel); // POST
app.post('/api/video/channels-remove/:channelType/:productId', videoController.removeChannel); // POST

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function () {
  console.log('Mock server listening on port ' + app.get('port'));
});
