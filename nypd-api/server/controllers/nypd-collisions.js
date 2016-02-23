var NYPDCollisions = require('../models/nypd-collisions');

module.exports.list = function (req, res) {
   var nypdCollisions = new NYPDCollisions(),
       // Query defaults
      query = {
            "pageNumber"      : 1,
            "pageSize"        : 50,
            "sortField"       : "date",
            "sortDirection"   : "asc",
            "filters"         : {}
      },
      // Sorting acceptable fields
      acceptableSortFields = [
         "date", "time", "borough", "zip_code"
      ],
      // Filter acceptable fields
      acceptableFilterFields = [
         "date", "time", "borough", "zip_code", "latlong", "distinmiles"
      ],
      errors = [],

    validationError = function (code, message) {
      errors.push({
         "code": code,
         "message": message
      });
    },
    validInt = function (num) {
      return (!isNaN(num) && num >= 1);
    }


   // Validate query parameters
   if (Object.keys(req.query).length) {
      var rawQuery = req.query;
      // Page
      if (typeof rawQuery.page == "object") {
         query.pageNumber = (rawQuery.page.number) ? parseInt(rawQuery.page.number, 10) : 1;
         if (!validInt(query.pageNumber)) {
            validationError("01", "Page number is expected as a positive integer");
         }
         query.pageSize = (rawQuery.page.size) ? parseInt(rawQuery.page.size, 10) : 50;
         if (!validInt(query.pageSize)) {
            validationError("02", "Page size is expected as a positive integer up to 50");
         }
         if (query.pageSize > 50) query.pageSize = 50;
      }
      // Sort
      if (typeof rawQuery.sort == "string" && rawQuery.sort != "") {
         if (rawQuery.sort.charAt(0) == "-") {
            query.sortDirection = "desc";
            query.sortField = rawQuery.sort.substring(1);
         } else {
            query.sortField = rawQuery.sort;
         }
         if (acceptableSortFields.indexOf(query.sortField) < 0) {
            query.sortDirection = "asc";
            query.sortField = "date";
         }
      }
      // Filers
      if (typeof rawQuery.filter == "object") {
         for (var filterName in rawQuery.filter) {
            if (acceptableFilterFields.indexOf(filterName) > -1) {
               query.filters[filterName] = rawQuery.filter[filterName].toUpperCase();
            }
         }
         if (query.filters['latlong']) {
            // latituge & longitude
            var latlong = [];
            if (query.filters['latlong'].indexOf(",") > 0) {
               latlong = query.filters.latlong.split(",");
            }
            if (isNaN(latlong[0]) || isNaN(latlong[1])) {
               validationError("03", "Location is expected as latitude and longitude separated by comma");
            } else {
               query.filters['latlong'] = [Number(latlong[0]), Number(latlong[1])];
            }
            // distance
            if (!query.filters['distinmiles']) query.filters['distinmiles'] = 0.1;
            if (isNaN(query.filters['distinmiles']) || query.filters['distinmiles'] < 0) {
               validationError("04", "Distance in miles is expected as a positive number up to 5");
            } else {
               query.filters['distinmiles'] = Number(query.filters['distinmiles']);
            }
            if (query.filters['distinmiles'] > 5) query.filters['distinmiles'] = 5;
         }
      }
   }


   if (errors.length) {
   // Respond with errors
      var result = {
         "jsonapi": {"version": "1.0"},
         "meta" : {},
         "errors": []
      };
      for (var i in errors) {
         result.errors.push({
            "title": errors[i].message,
            "code": errors[i].code
         });
      }
      res.writeHead(400, {'Content-Type': 'application/vnd.api+json'});
      res.write(JSON.stringify(result));
      res.end();
   } else {
   // Get data
      nypdCollisions.list(query, function (err, result) {
         var status = 200;
         if (err) {
            status = 500;
            result = JSON.stringify({
               "jsonapi": {"version": "1.0"},
               "meta" : {},
               "errors": [{
                  "code": 500,
                  "title": "500 Internal Server Error"
               }]
            });
         }
         res.writeHead(status, {'Content-Type': 'application/vnd.api+json'});
         res.write(result);
         res.end();
      });
   }

}
