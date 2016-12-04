(function () {
  'use strict';

  class HomeCtrl {
    constructor($scope, $geolocation, Pubnub, $log, $pubnubChannel) {
      'ngInject';
      const vm = this;
      vm.$log = $log;
      vm.$scope = $scope;
      vm.$geolocation = $geolocation;
      vm.$pubnubChannel = $pubnubChannel;
      vm.myPosition = 'Something';
      vm.lat = 1;
      vm.long = 1;
      vm.Pubnub = Pubnub;
      vm.Pubnub.init({
        publishKey: 'pub-c-bd389cd2-4ed5-46b8-884e-6cb24623872d',
        subscribeKey: 'sub-c-385e20e6-b9ac-11e6-9868-02ee2ddab7fe'
      });
      vm.$scope.channel = $pubnubChannel('locationrequest', {presence: true});

      vm.Pubnub.addListener({
        message: () => {
          vm.$geolocation.getCurrentPosition({
            timeout: 60000
          }).then(position => {
            vm.myPosition = `Position: Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
            vm.lat = position.coords.latitude;
            vm.long = position.coords.longitude;
            vm.Pubnub.publish({
              message: {
                lat: vm.lat,
                long: vm.long
              },
              channel: 'location'
            }, (status, response) => {
              if (status.error) {
                vm.$log.log(status);
              } else {
                vm.$log.log('message Published w/ timetoken', response.timetoken);
              }
            });
          });
        }
      });

      vm.Pubnub.subscribe({
        channels: ['locationrequest']
      });
    //   $rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), function (ngEvent, status, response) {
    //     $scope.$apply(function () {
    //         if (status.error){
    //            $scope.statusSentSuccessfully = false;
    //         } else {
    //            $scope.statusSentSuccessfully = true;
    //         }
    //      })
    // });
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
