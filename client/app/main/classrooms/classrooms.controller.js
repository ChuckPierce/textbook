'use strict';

angular.module('textbookApp')
  .controller('ClassroomsCtrl', function ($scope, $state, $stateParams, User, Classroom, Student, Auth, Conversation, socket, $modal) {
    $scope.user = Auth.getCurrentUser();
    $scope.unread = {};
    var convArray = [];

    Conversation.query().$promise.then(function(conversations) {
        conversations.forEach(function(convo) {
          if (convo.unreadMessages > 0) convArray.push(convo);
        });
        $scope.user.$promise.then(function(user) {
          user.classrooms.forEach(function(classroom) {
            classroom.students.forEach(function(student) {
              student.contacts.forEach(function(contact) {
                if (_.find(convArray, function(convo) {
                  return convo.contactId == contact._id
                })) {
                  // for now.  i know this is so bad
                  var additionToUnread = {};
                  additionToUnread[classroom._id] = {};
                  additionToUnread[classroom._id][student._id] = {};
                  additionToUnread[classroom._id][student._id][contact._id] = 1;
                  _.merge($scope.unread, additionToUnread);
                }
              })
            })
          });
          Conversation.setUnread($scope.unread);
          $scope.applyFlags();
        });
      });

    $scope.open = function () {
        console.log($scope.user.classrooms);
        $modal.open({
            templateUrl: 'app/main/classrooms/homeworkmodal.html',
            backdrop: true,
            windowClass: 'modal',
            scope: $scope
        });
    };
    $scope.status = {
      isopen: false
    };

    $scope.selectedClass = 'Select a Class';
    $scope.homeworkActiveClass = function(className){
      $scope.selectedClass = className;
    }
    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };
    $scope.assignment;
    $scope.addAssignment = function(assignment){
      $scope.assignment = "";
      console.log($scope.selectedClass);
      for(var i = 0 ; i<$scope.user.classrooms.length; i++){
        if($scope.user.classrooms[i].name == $scope.selectedClass){
          var classObj = $scope.user.classrooms[i];
        }
      }
      Classroom.addHomework({classId: classObj._id, homework: assignment}).$promise.then(function(homework){
        console.log(homework);
        $scope.selectedClass = 'Select a Class';
      });
    };
 
    $scope.$on('updated user', function(event, data) {
      $scope.user = Auth.getCurrentUser();  
    });

    $scope.$on('delete classroom', function(event, data) {
      User.get().$promise.then(function(user) {
        $scope.user = user;
        if(user.classrooms.length === 0) {
          $state.go('classrooms');
        } else {
          $state.go('classrooms.classroom', {classId: user.classrooms[0]._id});
        }
      });
    });

    $scope.applyFlags = function(contactId) {
      $scope.unread = Conversation.getUnread();
    };

    socket.socket.on('new message', function(res){
      if (!$state.params.contactId || $state.params.contactId !== res.convo.contactId) {
        $scope.user.classrooms.forEach(function(classroom) {
          classroom.students.forEach(function(student) {
            var contact = _.find(student.contacts, function(c) { return c._id == res.convo.contactId});
              if (contact) {
                if ($scope.unread[classroom._id] && $scope.unread[classroom._id][student._id] && $scope.unread[classroom._id][student._id][contact._id]) {
                  $scope.unread[classroom._id][student._id][contact._id]++;
                }
                else {
                  // i am so sorry for this
                  var additionToUnread = {};
                  additionToUnread[classroom._id] = {};
                  additionToUnread[classroom._id][student._id] = {};
                  additionToUnread[classroom._id][student._id][contact._id] = 1;
                  _.merge($scope.unread, additionToUnread);
                }
              }
            });
          })
       }
    });
});
