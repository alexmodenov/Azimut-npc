/*! 
 * Roots v 2.0.0
 * Follow me @adanarchila at Codecanyon.net
 * URL: http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999
 * Don't forget to rate Roots if you like it! :)
 */

// In this file we are goint to include all the Controllers our app it's going to need

(function(){
  'use strict';
 
  var app = angular.module('app', ['onsen', 'angular-images-loaded', 'ngMap', 'angular-carousel']);

  // Filter to convert HTML content to string by removing all HTML tags
  app.filter('htmlToPlaintext', function() {
      return function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
      }
    }
  );

  app.directive('datePicker', function () {
      return {
          link: function postLink(scope, element, attrs) {
              scope.$watch(attrs.datePicker, function () {
                  if (attrs.datePicker === 'start') {
                      //element.pickadate();
                  }
              });
          }
      };
  });  

  app.controller('networkController', function($scope){

    // Check if is Offline
    document.addEventListener("offline", function(){

      offlineMessage.show();

      /* 
       * With this line of code you can hide the modal in 8 seconds but the user will be able to use your app
       * If you want to block the use of the app till the user gets internet again, please delete this line.       
       */

      setTimeout('offlineMessage.hide()', 8000);  

    }, false);

    document.addEventListener("online", function(){
      // If you remove the "setTimeout('offlineMessage.hide()', 8000);" you must remove the comment for the line above      
      // offlineMessage.hide();
    });

  });

  // This functions will help us save the JSON in the localStorage to read the website content offline

  Storage.prototype.setObject = function(key, value) {
      this.setItem(key, JSON.stringify(value));
  }

  Storage.prototype.getObject = function(key) {
      var value = this.getItem(key);
      return value && JSON.parse(value);
  }

  // This directive will allow us to cache all the images that have the img-cache attribute in the <img> tag
  app.directive('imgCache', ['$document', function ($document) {
    return {
      link: function (scope, ele, attrs) {
        var target = $(ele);

        scope.$on('ImgCacheReady', function () {

          ImgCache.isCached(attrs.src, function(path, success){
            if(success){
              ImgCache.useCachedFile(target);
            } else {
              ImgCache.cacheFile(attrs.src, function(){
                ImgCache.useCachedFile(target);
              });
            }
          });
        }, false);

      }
    };
  }]);    



 // News Controller
app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);
app.controller('newsController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){
  $scope.yourAPI = 'http://azimut-npc.ru/api/get_recent_posts';
  $scope.items = [];
  $scope.totalPages = 0;
  $scope.currentPage = 1;
  $scope.pageNumber = 1;
  $scope.isFetching = true;
  $scope.getAllRecords = function(pageNumber){
    $scope.isFetching = true;
        $http.jsonp($scope.yourAPI+'/?page='+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {
      $scope.items = $scope.items.concat(response.posts);
      $scope.totalPages = response.pages;
      $scope.isFetching = false;
      if($scope.currentPage==$scope.totalPages){
        $('.news-page #moreButton').fadeOut('fast');  
      }
      });
   
  };
  $scope.showPost = function(index){
      
    $rootScope.postContent = $scope.items[index];
      $scope.ons.navigator.pushPage('post.html');
  };
  $scope.nextPage = function(){
    
    $scope.pageNumber = ($scope.currentPage + 1);
    if($scope.pageNumber &lt;= $scope.totalPages){
      $scope.getAllRecords($scope.pageNumber);
      $scope.currentPage++;
    }
  }
}]);
app.controller('postController', [ '$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
  
  $scope.item = $rootScope.postContent;
  $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);
  // Map Markers Controller

  app.controller('markersController', function($scope, $compile){
    
    $scope.infoWindow = {
      title: 'title',
      content: 'content'
    };

    $scope.markers = [
      {
        'title' : 'ООО «НПЦ Азимут»',
        'content' : 'Тульская обл., Венёвский район, поселок Метростроевский, Бяковский проезд, дом 12',
        'location'  : [54.402780, 38.202593]
      }
      
      ];

      $scope.showMarker = function(event){

        $scope.marker = $scope.markers[this.id];
          $scope.infoWindow = {
          title: $scope.marker.title,
          content: $scope.marker.content
        };
        $scope.$apply();
        $scope.showInfoWindow(event, 'marker-info', this.getPosition());

      }

  });

  app.controller('bookingController', function($scope, $compile, $filter){

    $scope.bookdate = 'Pick Reservation Date';
    $scope.booktime = 'Pick Reservation Time';

    $scope.chooseDate = function(){
      
      var options = {
        date: new Date(),
        mode: 'date'
      };

      datePicker.show(options, function(date){
        
        var day   = date.getDate();
          var month   = date.getMonth() + 1;
          var year  = date.getFullYear();

          $scope.$apply(function(){
            $scope.bookdate = $filter('date')(date, 'MMMM d, yyyy');      
          });

      });

    }

    $scope.chooseTime = function(){
      
      var options = {
        date: new Date(),
        mode: 'time'
      };

      datePicker.show(options, function(time){
          $scope.$apply(function(){
            $scope.booktime = $filter('date')(time, 'hh:mm a');
          });
      });

    }

  });

  // Plugins Controller

  app.controller('pluginsController', function($scope, $compile){

    $scope.openWebsite = function(){
      var ref = window.open('http://google.com', '_blank', 'location=yes');
    }

    $scope.openSocialSharing = function(){
      
      window.plugins.socialsharing.share('Message, image and link', null, 'https://www.google.com/images/srpr/logo4w.png', 'http://www.google.com');

      /*
       *  Social Sharing Examples
       *  For more examples check the documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
   
        window.plugins.socialsharing.share('Message only')
        window.plugins.socialsharing.share('Message and subject', 'The subject')
        window.plugins.socialsharing.share(null, null, null, 'http://www.google.com')
        window.plugins.socialsharing.share('Message and link', null, null, 'http://www.google.com')
        window.plugins.socialsharing.share(null, null, 'https://www.google.com/images/srpr/logo4w.png', null)
        window.plugins.socialsharing.share('Message and image', null, 'https://www.google.com/images/srpr/logo4w.png', null)
        window.plugins.socialsharing.share('Message, image and link', null, 'https://www.google.com/images/srpr/logo4w.png', 'http://www.google.com')
        window.plugins.socialsharing.share('Message, subject, image and link', 'The subject', 'https://www.google.com/images/srpr/logo4w.png', 'http://www.google.com')
      *
      */

    }


    $scope.openEmailClient = function(){

      ons.ready(function(){

        cordova.plugins.email.open({
          to:      'azimut-npc@ya.ru',
          subject: 'Письмо отправленное из приложения',
          body:    '',
          isHtml:  true
        });

      });
      
    }

    $scope.getDirectionsApple = function(){
      
      window.location.href = "maps://maps.apple.com/?q=37.774929,-122.419416";

    }

    $scope.getDirectionsGoogle = function(){

      var ref = window.open('http://maps.google.com/maps?q=37.774929,-122.419416', '_system', 'location=yes');

    }

    $scope.getDate = function(){
      
      var options = {
        date: new Date(),
        mode: 'date'
      };

      datePicker.show(options, function(date){
        alert("date result " + date);  
      });

    }

  });

})();
