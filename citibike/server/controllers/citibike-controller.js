var CityBike = require('../models/citybike');

module.exports.list = function (req, res) {
   var cityBike = new CityBike();
   cityBike.listAll({}, function (err, result) {
      if (err) {
         _result = "{\"error\": \""+ err.toString() +"\"}";
      } else {
         _result = result;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(_result);
      res.end();
      //res.json(_result);
   });

// send static file
//   res.sendFile( __dirname + "/data.js" );
/*
// read ens send data
   fs.readFile(__dirname + "/data.js", function (err, data) {
      if (err) {
         console.log(err);
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         res.writeHead(404, {'Content-Type': 'text/html'});
      }else{	
         //Page found	  
         // HTTP Status: 200 : OK
         // Content Type: text/plain
         res.writeHead(200, {'Content-Type': 'text/html'});
         
         // Write the content of the file to response body
         res.write(data.toString());
      }
      // Send the response body 
      res.end();
   }); 

// read and send as json
   fs.readFile(__dirname + "/data.js", 'utf8', function (err, data) {
      if (err) {
         res.writeHead(404, {'Content-Type': 'text/html'});
	 res.end();
      }else{	
	 res.status(200).json(data);
      }
   });
*/
}
