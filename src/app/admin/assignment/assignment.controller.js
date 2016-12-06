(function(angular) {
    
    'use strict';
    
    angular
        .module('spmiFrontEnd')
        .controller('AssignmentController', AssignmentController)
        .controller('CreateAssignmentController', CreateAssignmentController)
        .controller('UpdateAssignmentController', UpdateAssignmentController)
        
        .controller('DetailAssignmentController', DetailAssignmentController)
        
  
        .filter('propsFilter', function() {
            return function(items, props) {
                var out = [];

                if (angular.isArray(items)) {
                    items.forEach(function(item) {
                        var itemMatches = false;

                        var keys = Object.keys(props);
                        for (var i = 0; i < keys.length; i++) {
                            var prop = keys[i];
                            var text = props[prop].toLowerCase();
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        }

                        if (itemMatches) {
                            out.push(item);
                        }
                    });
                } else {
                    // Let the output be the input untouched
                    out = items;
                }

                return out;
            };
        })

    function AssignmentController($state, assignments) {
        
        var vm = this;
        
        vm.assignments = assignments;
        
        vm.detail = function(id) {
            $state.go('main.admin.assignment.detail', {assignmentId: id});
        }
        
        return vm;
    }
    
    function CreateAssignmentController($rootScope, $scope, $state, users, groupJobs, AssignmentService) {
        
        var vm = this;
        
        vm.input = {}; 
        vm.input.assignments = [];
        vm.input.users = []
        
        vm.person = {};
        vm.multipleDemo = {};
        
        vm.groupJobs = groupJobs;
        
        /*
        vm.people = [
            { name: 'Adam',      email: 'adam@email.com',      age: 12, country: 'United States' },
            { name: 'Amalie',    email: 'amalie@email.com',    age: 12, country: 'Argentina' },
            { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
            { name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador' },
            { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30, country: 'Ecuador' },
            { name: 'Samantha',  email: 'samantha@email.com',  age: 30, country: 'United States' },
            { name: 'Nicole',    email: 'nicole@email.com',    age: 43, country: 'Colombia' },
            { name: 'Natasha',   email: 'natasha@email.com',   age: 54, country: 'Ecuador' },
            { name: 'Michael',   email: 'michael@email.com',   age: 15, country: 'Colombia' },
            { name: 'Nicolás',   email: 'nicolas@email.com',    age: 43, country: 'Colombia' }
        ];
        */
        
        vm.people = users;
        
  
        vm.multipleDemo.selectedPeopleWithGroupBy = [];
        
        vm.someGroupFn = function (item){

            if (item.name[0] >= 'A' && item.name[0] <= 'M')
                return 'From A - M';

            if (item.name[0] >= 'N' && item.name[0] <= 'Z')
                return 'From N - Z';

        };
        
        function toggleEdit() {
            for(var i = 0; i < vm.input.assignments.length; i++) {
                vm.input.assignments[i].onEdit = false;
                
                if (vm.input.assignments[i].name || vm.input.assignments[i].description) {
                    
                } else {
                    vm.input.assignments.splice(i, 1);    
                }
            }
        }
        
        $scope.$watch('vm.multipleDemo', function() {
            
            vm.input.users = [];
            
            for(var i = 0; i < vm.multipleDemo.selectedPeopleWithGroupBy.length; i++) {
                
                $rootScope.pushIfUnique(vm.input.users, vm.multipleDemo.selectedPeopleWithGroupBy[i])
                
            }
            
            for (var i = 0; i < vm.multipleDemo.selectedGroupJobs.length; i++) {
                
                for (var j = 0; j < vm.multipleDemo.selectedGroupJobs[i].users.length; j++) {
                    
                    $rootScope.pushIfUnique(vm.input.users, vm.multipleDemo.selectedGroupJobs[i].users[j])
                        
                }
                
                
            }
            
            
            
        }, true);
       
        vm.addNew = function() {
            
            toggleEdit();
                
            var assignment = {
                onEdit: true,
                onHover: false,
                name: '',
                description: ''
            }
            
            vm.input.assignments.push(assignment);
            
        }
        
        vm.updateNode = function(object, index) {
            toggleEdit();
            
            object.onEdit = true;
            object.onHover = false;
        }
        
        vm.deleteNode = function(object, index) {
            var cnf = confirm('Apakah Anda yakin ingin menghapus assignment ini?')
            if (cnf == true) {
                vm.input.assignments.splice(index, 1);
            }
        }
        
        vm.submit = function() {
            AssignmentService.store(vm.input)
                .then(function(data) {
                    alert('Insert berhasil');
                    $state.go('main.admin.assignment', null, {reload: true});
                })
        }
  
        return vm;
    }
    
    function UpdateAssignmentController($state, assignment, AssignmentService) {
        
        var vm = this;
        
        return vm;
    }
    
    
    function DetailAssignmentController($state, assignment, AssignmentService) {
        
        var vm = this;
        
        vm.assignment = assignment;
        return vm;
        
    }
})(angular);