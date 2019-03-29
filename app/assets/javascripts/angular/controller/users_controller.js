var myApp = angular.module('myapplication', ['ngRoute', 'ngResource']);

//Factory
myApp.factory('Users', ['$resource',function($resource){
    return $resource('/users.json', {},{
        query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
    })
}]);

myApp.factory('User', ['$resource', function($resource){
    return $resource('/users/:id.json', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: {id: '@id'} },
        delete: { method: 'DELETE', params: {id: '@id'} }
    });
}]);

//Controller
myApp.controller("UserListCtr", ['$scope', '$http', '$resource', 'Users', 'User', '$location', function($scope, $http, $resource, Users, User, $location) {

    $scope.users = Users.query();

    $scope.deleteUser = function (userId) {
        if (confirm("Are you sure you want to delete this user?")){
            User.delete({ id: userId }, function(){
                $scope.users = Users.query();
                $location.path('/');
            });
        }
    };
}]);

myApp.controller("UserUpdateCtr", ['$scope', '$resource', 'User', '$location', '$routeParams', function($scope, $resource, User, $location, $routeParams) {
    $scope.user = User.get({id: $routeParams.id});
    $scope.update = function(){
        if ($scope.userForm.$valid){
            User.update({id: $scope.user.id.$oid},{user: $scope.user},function(){
                $location.path('/users/' + $scope.user.id.$oid + '/show');
            }, function(error) {
                console.log(error)
            });
        }
    };
}]);

myApp.controller("UserAddCtr", ['$scope', '$resource', 'Users', '$location', function($scope, $resource, Users, $location) {
    $scope.user = {addresses: [{street1: '', street2: '', city: '', state: '', country: '', zipcode: '' }]}
    $scope.save = function () {
        if ($scope.userForm.$valid){
            Users.create({user: $scope.user}, function(){
                $location.path('/');
            }, function(error){
                console.log(error)
            });
        }
    };
}]);

myApp.controller("UserShowCtr", ['$scope', '$resource', 'User', '$location', '$routeParams', function($scope, $resource, User, $location, $routeParams) {
    $scope.user = User.get({id: $routeParams.id});
}]);


//Routes
myApp.config([
    '$routeProvider', function($routeProvider) {
        $routeProvider.when("/users",{
            templateUrl: "/templates/users/index.html",
            controller: "UserListCtr"
        });
        $routeProvider.when("/users/new", {
            templateUrl: "/templates/users/new.html",
            controller: "UserAddCtr"
        });
        $routeProvider.when("/users/:id/edit", {
            templateUrl: "/templates/users/edit.html",
            controller: "UserUpdateCtr"
        });
        $routeProvider.when("/users/:id/show", {
            templateUrl: "/templates/users/show.html",
            controller: "UserShowCtr"
        });
        $routeProvider.otherwise({
            redirectTo: "/users"
        });
    }
]);