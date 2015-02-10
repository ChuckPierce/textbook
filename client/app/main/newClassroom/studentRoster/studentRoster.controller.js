'use strict';

angular.module('textbookApp')
  .controller('StudentRosterCtrl', function ($scope, $state, Classroom, User, $http) {
  	$scope.newClass = {
  		students: []
  	}
  	$scope.rows = [];
  	$scope.columnNames = Object.keys($scope.studentRoster[0]);
  	$scope.modelNames = {'firstName':'first name', 'lastName': 'last name', 'name': 'primary contact\'s name', 'phone': 'primary contact\'s phone number', 'relationship': 'relation to primary contact'};
  	$scope.columnSelected = {};
  	console.log($scope.columnNames);
    angular.forEach($scope.studentRoster, function(column) {
    	$scope.rows.push(column);
    });

    $scope.changeDataKey = function(model) {
    	console.log($scope.columnSelected);
    	$scope.studentRoster.forEach(function(column) {
    		for(var key in column) {
    			if(key === $scope.columnSelected[model]) {
    				console.log($scope.columnSelected[model])
    				column[model] = column[key];
    				delete column[key]; 
    			}
    		}
    	});
    	console.log($scope.studentRoster[0]);
    };

    $scope.createClass = function() {
    	User.getUnpopulated({id: $scope.user._id}, function(user) {
	    	Classroom.save($scope.newClass, function(classroom) {
	    		$scope.newClass._id = classroom._id;
	    		user.classrooms.push(classroom._id);
	    		User.update(user);
	    	});
    	});
    }

    $scope.saveData = function() {
    	$http.post('/api/classrooms/'+ $scope.newClass._id +'/saveSpreadsheet', $scope.studentRoster)
    	.success(function(classroom) {
    		console.log(classroom);
    		$scope.$emit('updated user');
    		$state.go('classrooms.classroom', {classId: classroom._id});
    	});
    };
  });
