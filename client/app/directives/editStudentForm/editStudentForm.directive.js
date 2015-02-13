'use strict';

angular.module('textbookApp')
  .directive('editStudentForm', function (Contact, Student) {
    return {
      templateUrl: 'app/directives/editStudentForm/editStudentForm.html',
      restrict: 'EA',
      scope: {
      	currentStudent: '=curr'
      },
      link: function (scope, element, attrs) {
	  }
	}
	  })
	.controller('editStudentFormCtrl', function($scope, Contact, Student) {

	    $scope.saveStudent = function() {
	    	$scope.editStudentSubmit = true;
	      if ($scope.editStudent.$valid) {
	         var studentToUpdate = _.clone($scope.currentStudent);
	         studentToUpdate.contacts = studentToUpdate.contacts.map(function(contact) {return contact._id});
	         Student.update(studentToUpdate, function(student) {
	         	console.log(student);
	         });
	         $scope.editStudentSubmit = false;
	      }
	    };

	    $scope.deleteContact = function(contactId) {
	    	$scope.currentStudent.contacts.forEach(function(contact, i) {
	    		if(contact._id === contactId) {
	    			Contact.delete({id: contact._id});
	    			$scope.currentStudent.contacts.splice(i, 1);
	    		}	
	    	})
	    };

	    $scope.addEditView = '';
	    $scope.addShowEdit = function(contactId) {
	      if($scope.addEditView === contactId) {
	        $scope.addEditView = '';
	      } else {
	        $scope.addEditView = contactId;  
	      }
	    };

	      $scope.$on('close addeditview', function(event, data) {
	        $scope.addEditView = '';
	      });
	});
