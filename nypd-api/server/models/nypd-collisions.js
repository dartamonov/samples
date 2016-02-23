var fs = require("fs"),
    appRoot = require('app-root-path');

var NYPDCollisions = function () {  
  this.dataPath = appRoot + "/data/rows-10k.json",
  this._map = {} // Map of column indexes in NYPD JSON
}

NYPDCollisions.prototype.list = function (query, callback) {
  var self = this;
  fs.readFile(this.dataPath, function (err, buf) {
    if (err) {
      var message = "Error on getting data from " + self.dataPath;
      console.log(message);
      callback(new Error(message));
    } else {
      var resultJson,
          nypdJson = JSON.parse(buf);
      // Map column indexes
      for (var i=0; i < nypdJson.meta.view.columns.length; i++) {
        self._map[nypdJson.meta.view.columns[i].fieldName] = i;
      }
      // Filter
      resultJson = self.filter(nypdJson.data, query.filters);
      // Sort
      resultJson = self.sort(resultJson, query.sortField, query.sortDirection);
      // Paginate
      var pagesTotal = Math.ceil(resultJson.length / query.pageSize),
          from = (query.pageNumber - 1) * query.pageSize,
          to = query.pageNumber * query.pageSize;
      if (to > resultJson.length) to = resultJson.length;
      resultJson = resultJson.slice(from, to);

      resultJson = JSON.stringify({
        "jsonapi": {"version": "1.0"},
        "meta" : {
          "pageNumber": query.pageNumber,
          "pageSize": query.pageSize,
          "pagesTotal": pagesTotal
        },
        "data": self.torResourceObjects(resultJson) // Convert to JSON API resource object format
      });
      callback("", resultJson);
    }
  }); 
}

NYPDCollisions.prototype.filter = function (dataObj, filters) {
  var result = [];
  for (var i in dataObj) {
    // Skip null record
    if (dataObj[i][this._map['borough']] == null) continue;

    var isValid = true;
    // Simple filters
    for (var filterName in filters) {
      if (filterName == "latlong" || filterName == "distinmiles") continue;
      // strict match
      // if (dataObj[i][this._map[filterName]] != filters[filterName]) {
      // partial match
      if (dataObj[i][this._map[filterName]] == null || 
          dataObj[i][this._map[filterName]].indexOf(filters[filterName]) < 0
      ) { 
        isValid = false;
        break;
      }
    }
    // Location, distance filter
    if (filters.latlong) {
          lat1 = filters.latlong[0],
          long1 = filters.latlong[1],
          lat2 = dataObj[i][this._map['latitude']],
          long2 = dataObj[i][this._map['longitude']];

      if (lat2 == null || long2 == null) {
        isValid = false;
      } else {
        var radlat1 = Math.PI * lat1/180,
            radlat2 = Math.PI * lat2/180,
            theta = long1-long2,
            radtheta = Math.PI * theta/180,
            dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (dist > filters.distinmiles) isValid = false;
      }
    }

    if (isValid) result.push(dataObj[i]);
  }

  return result;
}

NYPDCollisions.prototype.sort = function (dataObj, field, direction) {
  var result = dataObj,
      _m = this._map,
  sortByField = function (field) {
    return function (collision1, collision2) {
        var sortStatus = 0;
        if (direction == "desc") {
          if (collision1[_m[field]] < collision2[_m[field]]) {
              sortStatus = -1;
          } else if (collision1[_m[field]] > collision2[_m[field]]) {
              sortStatus = 1;
          }
        } else {
          if (collision1[_m[field]] > collision2[_m[field]]) {
              sortStatus = -1;
          } else if (collision1[_m[field]] < collision2[_m[field]]) {
              sortStatus = 1;
          }
        }
        return sortStatus;
    };
  };

  result.sort(sortByField(field));
  return result;
}

NYPDCollisions.prototype.torResourceObjects = function (arr) {
  var resourceObjects = [];
  for (var i in arr) {
    var resourceObj = {
      "type": "collision",
      "id": arr[i][0],
      "attributes": {}
    }
    for (var column in this._map) {
      resourceObj.attributes[column] = arr[i][this._map[column]];
    }
    resourceObjects.push(resourceObj);
  }
  return resourceObjects;
}

module.exports = NYPDCollisions;