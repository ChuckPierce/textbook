'use strict';

angular.module('textbookApp')
    .factory('Conversation', function ($resource) {
    var Conversation = $resource('/api/fonversations/:id', { id: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
    return Conversation;
  });
