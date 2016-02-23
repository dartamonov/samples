app.controller('NYPDCollisionsController', ['$scope', '$resource', function ($scope, $resource) {

  $scope.collisions = [];
  $scope.errors = [];

  $scope.update = function () {
    var _page = ($scope.currentPage) ? "page[number]=" + $scope.currentPage : "page[number]=1",
        _pageSize = ($scope.pageSize) ? "&page[size]=" + $scope.pageSize : "&page[size]=50",
        _sort = ($scope.sortField) ? "&sort=" + $scope.sortField.toLowerCase() : "&sort=date",
        _filter = "";
    if ($scope.searchDate)     _filter += '&filter[date]=' + $scope.searchDate;
    if ($scope.searchTime)     _filter += '&filter[time]=' + $scope.searchTime;
    if ($scope.searchBorough)  _filter += '&filter[borough]=' + $scope.searchBorough;
    if ($scope.searchZip)      _filter += '&filter[zip_code]=' + $scope.searchZip;
    if ($scope.searchLocation) _filter += '&filter[latlong]=' + $scope.searchLocation;
    if ($scope.searchRadius)   _filter += '&filter[distinmiles]=' + $scope.searchRadius;

    $scope.apiUrl = '/1.0/collisions?' + _page + _pageSize + _sort + _filter;
    $resource($scope.apiUrl).get (
      // on result
      function (result) {
        console.log(result);
        $scope.errors = [];
        $scope.collisions = result.data;
        $scope.currentPage = result.meta.pageNumber;
        $scope.pageSize = result.meta.pageSize;
        $scope.pageNumbers = [];
        for (var i=1; i <= result.meta.pagesTotal; i++) {
          $scope.pageNumbers.push(i);
        }
      },
      // on error
      function (err) {
        $scope.errors = [];
        $scope.collisions = [];
        console.log(err);
        if (err.data.errors) {
          for (var i=0; i < err.data.errors.length; i++) {
            $scope.errors.push(err.data.errors[i]);
          }
        }
      }
    );
    return false;
  }

  $scope.searchByFilter = function($event) {
    $scope.currentPage = 1;
    $scope.update();
  }

  $scope.searchByLocation = function($event) {
    $scope.searchLocation = $($event.currentTarget).text();
    $scope.update();
  }

  $scope.toPageNum = function($event) {
    $event.preventDefault();
    $scope.currentPage = $($event.currentTarget).text();
    $scope.update();
  }

  $scope.update();

}]);
