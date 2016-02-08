var fs = require("fs");

var CityBike = function () {  
  this.dataPath = __dirname + "/../../data/data.json";
  this.data = "";
  this.initialized = false;
}

CityBike.prototype.init = function (obj, callback) {
  console.log(this.dataPath);
  fs.readFile(this.dataPath, function (err, cbData) {
    if (err) {
        console.log("Error: on getting data from " + this.dataPath);
        this.data = "";
    } else {
        console.log("data from " + this.dataPath + " receiveed");
        this.data = cbData;
    }
    callback("", this.data);
 }); 
}

CityBike.prototype.listAll = function (obj, callback) {
  //console.log("listAll called");
  if (this.initialized) {
    callback("", this.data);
  } else {
    this.init(obj, callback);
  }
}

module.exports = CityBike;