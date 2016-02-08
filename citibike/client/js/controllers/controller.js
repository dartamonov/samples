app.controller('citibikeController', ['$scope', '$resource', function ($scope, $resource) {

  var CityBike = $resource('/api/citibike');
  //var CityBike = $resource('/data.json');  

  //$scope.placeholder = "Loading...";
  $scope.stations = [];

  //CityBike.query(function (results) { // expects array as result
  CityBike.get(function (result) { // expects object as result
    console.log(result);

    $scope.updatedOn = result.executionTime;
    $scope.__stations = []; // all stations cache
    // Optimize for search
    for (i = 0; i < result.stationBeanList.length; i++) {
      station = result.stationBeanList[i]
      station._street = station.stationName.toLowerCase().trim().replace(/\s\s+/g, ' ');
      $scope.__stations.push(result.stationBeanList[i]);
    }
    $scope.stations = result.stationBeanList;
  });

  $scope.searchBySreet = function () {
    //console.log("Search by: " + $scope.streetName);
    //console.log($scope.stations);
    var searchStr = $scope.streetName.toLowerCase().trim().replace(/\s\s+/g, ' ');
    $scope.stations = $scope.__stations;
    $res = [];
    for (i = 0; i < $scope.stations.length; i++) {
      if ($scope.stations[i]._street.indexOf(searchStr) > -1) {
        $res.push($scope.stations[i]);
      }
    }
    $scope.stations = $res;
    $scope.streetName = "";
  }

}]);