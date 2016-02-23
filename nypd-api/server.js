var express        = require('express'),
    app            = express(),
    nypdCollisions = require('./server/controllers/nypd-collisions');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/views/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));

//REST API
app.get('/1.0/collisions', nypdCollisions.list);

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
	console.log('Up and running on port', app.get('port'));
})