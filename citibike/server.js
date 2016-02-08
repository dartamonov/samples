var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    cbController = require('./server/controllers/citibike-controller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/views/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));
//app.use('/data', express.static(__dirname + '/data/data.json'));

//REST API
app.get('/api/citibike', cbController.list);
//res.end( JSON.stringify( response ) )


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
	console.log('Up and running on port', app.get('port'));
})