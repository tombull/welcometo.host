(function () {
  'use strict';

  class HomeCtrl {
    constructor($scope, $geolocation) {
      'ngInject';
      const vm = this;
      vm.$scope = $scope;
      vm.$geolocation = $geolocation;
      vm.$geolocation.getCurrentPosition({
        timeout: 60000
      }).then(position => {
        vm.$scope.myPosition = position;
      });
    }
  }

  /**
   * @ngdoc object
   * @name home.controller:HomeCtrl
   *
   * @description
   *
   */
  angular
    .module('home')
    .controller('HomeCtrl', HomeCtrl);
}());
