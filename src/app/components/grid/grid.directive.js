(function(angular) {

    'use strict';

    angular.module('spmiFrontEnd')
        .directive('gridView', gridView)
        .directive('gridViewToolbar', gridViewToolbar)

        .filter('objectConstruct', ObjectConstruct)

    
        .directive('ngMultiTransclude', function ()
        {
            return {
                controller: function($scope, $element, $attrs, $transclude) {
                    
                    if (!$transclude){
                        throw {
                            name: 'DirectiveError',
                            message: 'ng-multi-transclude found without parent requesting transclusion'
                        };
                    }

                    this.$transclude = $transclude;
                    
                },
                
                link: function($scope, $element, $attrs, $controller) {
                    
                    var selector = '[name=' + $attrs.ngMultiTransclude + ']';
                    console.log(selector);
                    var attach = function(clone) {
                        var $part = clone.find(selector).addBack(selector);
                        console.log($part);
                        $element.html('');
                        $element.append($part);
                    };
                    
                    /*
                    if ($controller.$transclude.$$element) {
                        attach($controller.$transclude.$$element);
                    } else {
                        $controller.$transclude(function(clone){
                            $controller.$transclude.$$element = clone;
                            attach(clone);
                        });
                    }
                    */
                    
                },
            };
        });

    function gridView ($compile, $q, $rootScope, $timeout) 
    {
        var directive = {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'app/components/grid/grid.directive.html',
            scope: {
                data: '=gridData',
                service: '=',
                fieldConfig: '=',
                actionConfig: '=',
            },
            controller: GridViewController,
            compile: compile,
        }

        function compile (tElement) 
        {
            var linkFunctions = {};
            
            tElement
                .children('grid-view-toolbar')
                .each(function iterator(i, node) {
                    var container = angular.element(node);
                    var role = container.attr('role');
                    if(role) {
                        linkFunctions[role] = $compile(container.contents());
                    }
                })
            
            var a = tElement
                .children('grid-view-toolbar')
                .each(function iterator(i, node) {
                    
                    var container = angular.element(node);
                    var role = container.attr('role');
                    if(role) {
                        linkFunctions[role] = $compile(container.contents());
                    }
                })
            
            return (link);
        }
    
        function link ($scope, $element, $attribute, $controller, $transclude) {
            
            $scope.currentPage = 1;
            $scope.perPage = 10;

        }

        function GridViewController ($scope, $element, $attrs, $transclude) 
        {

            var searchTimeout;

            $scope.success = function (data) {
                    
                    $scope.total = data.total;
                    $scope.currentPage = data.current_page;
                    $scope.data = data;
                }

            $scope. error = function (data) {
                $q.reject($rootScope.errorHandler(data));
            }

            $scope.$watch('query', function(newValue, oldValue) {
                //if ($scope.query) {
                    $timeout.cancel(searchTimeout);
                    searchTimeout = $timeout(function() {

                        var params = {
                            perPage: 10,
                            currentPage: 1,
                            keyword: newValue
                        }

                        $scope.service.call(this, params).then($scope.success, $scope.error);
                    }, 1000)
                //}
            })

            $scope.onShowChange = function() {

                var params = {
                    perPage: $scope.perPage,
                    currentPage: $scope.currentPage,
                    keyword: $scope.query
                }

                $scope.service.call(this, params).then($scope.success, $scope.error);
            }

            $scope.sorting = function(header) 
            {
                $scope.sortField = header; 
                $scope.reverse = !$scope.reverse;
            }
        }

        return directive;

    }

    function gridViewToolbar () {

        var directive = {
            restrict: 'E',
            transclude: true,
            require: '^^gridView',
            replace: true,
            link: function(scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template: '' +
                '<ng-transclude></ng-transclude>'
        }

        return directive;
    }

    function ObjectConstruct() {

        return function(input, param1, param2) {

            var output;
            var i = 0;
            var prop = param1.split(".", 10);
            
            if (prop.length > 1) {
                
                for (i = 0; i < prop.length; i++) 
                {
                    if (typeof output === 'object') {
                        output = output[prop[i]];
                    } else {
                        output = input[prop[i]];
                    }
                }
                
            } else {
                output = input[prop];
            }

            return output;
        }
    }


})(angular);