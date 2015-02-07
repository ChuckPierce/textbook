'use strict';

angular.module('textbookApp')
  .factory('User', function ($resource) {
    var finalUser;
    var User = $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      update: {
        method: 'PUT'
      },
      getUnpopulated: {
        method: 'GET',
        params: {
          controller: 'unpopulated'
        }
      }
	  });

    User.getFinalUser = function() {
      return finalUser;
    }

    User.setFactoryUser = function(user) {
      finalUser = user;
    }

    return User;

  });
