(function() {
    'use strict'
	angular.module('spmiFrontEnd')

		.directive('nodeList', nodeList)
		.directive('node', node)
		.directive('nodeFormList', nodeFormList)
    
    function nodeList ($compile) {
        return {
            restrict: 'E',												//PROJECT PHASE
            terminal: true,												// * 1 = Creation - Admin Stuff
            replace: true,												// * 2 = Delegation - User Stuff
            transclude: true,											// * 3 = Modification - Admin Stuff
            scope: {													// * 4 = Execution - User Stuff
                nodes: '=ngModel',										// * 5 = Assessment - Admin Stuff
                node: '=',												// * 6 = Completion - Admin Stuff
				users: '=',   
                assessors: '=',                                          // * 7 = Termination - Admin Stuff
				setting: '=',
                nodeController: '@',
                parentIndex: '@'
            },
            controller: '@',
            name: 'nodeController',
            link: function ($scope, $element, $attrs) {
    
                $scope.template = ''
                    + '<accordion close-others="false">'
                        + '<node ng-repeat="item in nodes track by $index" ng-model="item" nodes="nodes" users="users" assessors="assessors" setting="setting" node-index="$index + 1" parent-index="' + $scope.parentIndex + '" node-controller="' + $scope.nodeController + '"></node>'
                        
                        //button for add project node or project node form only available when Creation or Modification
                        + '<div ng-if="privilege.editableNode" class="pull-left" style="margin-top: 5px;">'
                            + '<button ng-if="!node.forms" ng-click="create(nodes)" class="btn btn-primary"><i class="fa fa-plus"></i></button>&nbsp;'
                            + '<button ng-if="parentIndex && !nodes.length && !node.forms" ng-click="createNodeForm(node)" class="btn btn-warning"><i class="fa fa-file-text-o"></i></button>'
                        + '</div>'
                    + '</accordion>'
    
                if (angular.isArray($scope.nodes)) {
                    $element.append($scope.template);
                } 
                $compile($element.contents())($scope.$new());
            }, 
        };
    }
    
    function node ($compile) {
        return {
            restrict: 'E',
            terminal: true,
            replace: true,
            transclude: true,
            scope: {
                node: '=ngModel',
                nodes: '=',
                users: '=',
                assessors: '=',
                setting: '=',
                nodeController: '@',
                nodeIndex: '=',
                parentIndex: '@'
            },
            controller: '@',
            name: 'nodeController',
    
            link: function ($scope, $element, $attrs) {
                if ($scope.parentIndex == 'undefined') {
                    $scope.parentIndexString = '';
                } else {
                    $scope.parentIndexString = $scope.parentIndex + '.';
                }
    
                $scope.parentIndexStringNode = $scope.parentIndexString + $scope.nodeIndex;
                $scope.node.index =  $scope.parentIndexString + $scope.nodeIndex + '. ';
                
                $scope.template = ''
                    + '<div style="margin-top: 5px;">'
                        + '<accordion-group is-open="node.open">'
                            + '<accordion-heading>'
                                + '<i class="pull-left glyphicon" ng-class="{'
                                    + '\'glyphicon-chevron-down\': node.open,'
                                    + '\'glyphicon-chevron-right\': !node.open}">'
                                + '</i>&nbsp;'
                                + '<span ng-if="!node.fixedIndex">{{ parentIndexString }}{{ nodeIndex }}. </span><span ng-if="node.fixedIndex">{{ node.fixedIndex }} </span>{{node.header}}'
                                
                                 + '<div ng-if="privilege.showLockNode" class="pull-right">'
                                    + '<button ng-click="lock($event)" class="btn btn-warning btn-xs"><i class="fa" '
                                    + 'ng-class="{ \'fa-lock\': node.lock == 1, \'fa-unlock\': node.lock == 0 }"></i></button>&nbsp;'
                                + '</div>'
                                
                                
                                //showing that had score that not unsigned
                                + '<div ng-if="privilege.showGrade && node.unsigned" class="pull-right">'
                                    + '<button class="btn btn-default btn-xs" popover="Terdapat pekerjaan dalam butir ini yang belum diberikan penilaian oleh assessors"'
                                        + 'popover-trigger="mouseenter"><i class="fa fa-exclamation-triangle"></i>'
                                    + '</button>&nbsp;'
                                + '</div>'
                                
                                //using for showing score on header. eyes catching effect
                                + '<div ng-if="privilege.showGrade" class="pull-right">'
                                    + '<button class="btn btn-xs" ng-class="{'
                                        + '\'btn-success\': adjustedScore >= 3.5,'
                                        + '\'btn-primary\': adjustedScore < 3.5 && adjustedScore >= 2.5,'
                                        + '\'btn-warning\': adjustedScore < 2.5 && adjustedScore >= 1.5,'
                                        + '\'btn-danger\': adjustedScore < 1.5 || adjustedScore == \'Unsigned\' }">'
                                        + '{{ (adjustedScore !== \'Unsigned\') ? (adjustedScore | number : 2) : \'0.00\' }}'
                                    + '</button>&nbsp;'
                                + '</div>'
                                
                                //how to assessors give a score
                                + '<div ng-if="node.forms && privilege.showAssess" class="pull-right">'
                                    + '<button ng-if="node.forms && privilege.showAssess" ng-click="assess()" class="btn btn-primary btn-xs">'
                                        + '<i class="fa fa-edit"></i>'
                                    + '</button>&nbsp;'
                                + '</div>'
                                
                                //can update or delete node when Creation and Modification
                                + '<div ng-if="privilege.editableNode" class="pull-right">'
                                    + '<button ng-click="update(nodeIndex, nodes, $event)" class="btn btn-success btn-xs"><i class="fa fa-edit fa-xs"></i></button>&nbsp;'
                                    + '<button ng-click="delete(nodeIndex, nodes, $event)" class="btn btn-danger btn-xs"><i class="fa fa-close fa-xs"></i></button>'
                                + '</div>'
                            + '</accordion-heading>'
                            
          
                            
                            //show delegation each project node
                            + '<div ng-if="privilege.showDelegation" class="row">'
                                + '<div class="col-md-7">'
                                    + '<h3>{{ node.header }}</h3>'
                                    + '<h4>Deskripsi</h4>'
                                    + '<div class="col-md-12">'
                                        + '<p>{{ node.description }}</p>'
                                    + '</div><br/>'
                                    
                                    + '<h4 ng-if="node.score  && node.score.id">Keterangan assessor</h4>'
                                    + '<small ng-if="node.score && node.score.id" class="text-muted">'
                                        + '<i class="fa fa-clock-o fa-fw"></i>'
                                        + '<span am-time-ago="node.score.created_at"></span>&nbsp;-&nbsp;{{ node.score.users.name }}'
                                    + '</small>'
                                    + '<div ng-if="node.score  && node.score.id" class="col-md-12">'
                                         + '<p>{{ node.score.description }}</p>'
                                    + '</div>'
                                + '</div>'

                                + '<div class="col-md-5">'
                                    + '<div class="panel panel-default">'
                                        + '<div class="panel-heading clearfix">'
                                            + '<div class="panel-title pull-left">'
                                                + 'Delegation'
                                            + '</div>'
                                            + '<div class="panel-title pull-right">'
                                                //show delegation button for leader
                                                + '<button ng-if="privilege.delegatable" ng-click="delegateNode(node)" class="btn btn-primary btn-xs"><i class="fa fa-plus fa-xs"></i></button>'
                                            + '</div>'
                                        + '</div>'
                                        + '<div class="panel-body">'
                                            + '<div class="list-group">'
                                                + '<a href="" ng-click="detail(work)" class="list-group-item" ng-repeat="object in node.delegations">'
                                                    + '<i class="fa" ng-class="{'
                                                        + '\'fa-user\': object.id !== ' + $scope.leaderId + ','
                                                        + '\'fa-star\': object.id == ' + $scope.leaderId 
                                                    + '}"></i>&nbsp;{{ object.name }}'
                                                + '</a>'
                                            + '</div>'
                                        + '</div>'
                                    + '</div>'
                                + '</div>'
                            + '</div>'
                            
                            //don't show delegation user list. because project just created
                            + '<div ng-if="privilege.showAssessorsNode" class="row">'
                                + '<div class="col-md-7">'
                                    + '<h3>{{ node.name }}</h3>'
                                    + '<h4>Deskripsi</h4>'
                                    + '<div class="col-md-12">'
                                        + '<p>{{ node.description }}</p>'
                                    + '</div><br/>'
                                + '</div>'
                                
                                + '<div class="col-md-5">'
                                    + '<div class="panel panel-default">'
                                        + '<div class="panel-heading clearfix">'
                                            + '<div class="panel-title pull-left">'
                                                + 'Assessors'
                                            + '</div>'
                                            + '<div class="panel-title pull-right">'
                                                + '<button ng-if="privilege.editableAssessorsNode" ng-click="assessorsNode(node)" class="btn btn-primary btn-xs"><i class="fa fa-plus fa-xs"></i></button>'
                                            + '</div>'
                                        + '</div>'
                                        + '<div class="panel-body">'
                                            + '<div class="list-group">'
                                                + '<a href="" class="list-group-item" ng-repeat="object in node.assessors">'
                                                    + '<i class="fa fa-user"></i>&nbsp;{{ object.name }}'
                                                + '</a>'
                                            + '</div>'
                                        + '</div>'
                                    + '</div>'
                                + '</div>'
                            + '</div>'
                            
                            //show project description for undelegated users
                            + '<div ng-if="!privilege.showAssessorsNode && !privilege.showDelegation" class="row">'
                                + '<div class="col-md-12">'
                                    + '<h3>{{ node.header }}</h3>'
                                    + '<h4>Deskripsi</h4>'
                                    + '<div class="col-md-12">'
                                        + '<p>{{ node.description }}</p>'
                                    + '</div><br/>'
                                + '</div>'
                            + '</div>'
                            
                          
                            
                            
                            //if has forms and the end of project node
                            + '<div ng-if="node.forms">'
                                + '<node-form-list ng-model="node" users="users" assessors="assessors" setting="setting" node-controller="' + $scope.nodeController + '"></node-form-list>'
                            + '</div>'
                            //if has not form and still had children
                            + '<div ng-if="!node.forms">'
                                + '<node-list ng-model="node.children" node="node" users="users" assessors="assessors" setting="setting" node-controller="' + $scope.nodeController + '" parent-index="' + $scope.parentIndexStringNode + '"></node-list>'
                            + '</div>'
                            
                        + '</accordion-group>'
                    + '</div>'
                    
                        
             
                
                $element.append($scope.template);
                $compile($element.contents())($scope.$new());
                
            }
        };
    }
                
    function nodeFormList ($compile) {
        return {
            restrict: 'E',
            terminal: true,
            replace: true,
            transclude: true,
            scope: {
                node: '=ngModel',
                nodes: '=',
                users: '=',   
                assessors: '=', 
                setting: '=',
                nodeController: '@',
            },
            controller: '@',
            name: 'nodeController',
            link: function ($scope, $element, $attrs) {
    
                $scope.template = ''
                    + '<div class="row">'
                        + '<div class="col-lg-12">'
                            + '<h4>Formulir</h4>'
                            + '<div class="row">'
                                + '<div ng-if="privilege.editableWeight" class="col-md-6">'									
                                    + '<div class="form-group has-feedback">'
                                        //show mandatory mark when editable weight true
                                        + '<label class="control-label">Bobot Pekerjaan</label>&nbsp;<label style="color: #a94442;">*</label>'
                                        + '<input type="number" min="0" max="100" step="0.01" ng-model="node.weight" name="name" class="form-control">'
                                    + '</div>'
                                + '</div>'
                                // show weight when not Creation and Modification 
                                + '<div ng-if="!privilege.editableWeight" class="col-md-12">'
                                    + '<label class="control-label">Bobot Pekerjaan : {{ node.weight }}</label>'
                                + '</div>'
                            + '</div>'
                            
                            + '<label ng-if="privilege.editableNode" class="control-label">Dafar Formulir Penugasan</label>&nbsp;<label ng-if="privilege.editableNode" style="color: #a94442;">*</label>'
                            + '<div class="panel panel-default">'
                                + '<div class="panel-heading clearfix">'
                                
                                    //can add Form Panel when Creation or Modification
                                    + '<div ng-if="privilege.editableNode" class="panel-title pull-left">'
                                        + '<div class="form-inline">'
                                            + '<div class="form-group">'
                                                + '<button ng-click="createNodeFormItem(node)" class="btn btn-primary btn-xs"><i class="fa fa-plus fa-xs"></i></button>'
                                            + '</div>'
                                        + '</div>'
                                    + '</div>'
                                    
                                    //can delete Form Panel when Creation or Modification
                                    + '<div ng-if="privilege.editableNode" class="pull-right">'
                                        + '<button ng-click="deleteNodeForm(node)" class="btn btn-danger btn-xs"><i class="fa fa-close fa-xs"></i></button>'
                                    + '</div>'
                                    
                                    //replace add and delete button if not Creation or Modification
                                    + '<label ng-if="!privilege.editableNode" class="control-label">Dafar Formulir Penugasan</label>'
                                    
                                + '</div>'
                                + '<div class="panel-body">'
                                    + '<div class="row">'
                                        + '<div class="col-md-12">'
                                            + '<div class="table-responsive">'
                                                + '<table class="table table-hover">'
                                                    + '<thead>'
														+ '<tr>'
															+ '<th>#</th>'
															+ '<th><a href="" ng-click="sortField = \'name\'	; reverse = !reverse">Formulir</a></th>'
															//showing uploaded form header
                                                            + '<th ng-if="privilege.showFormUpload"><a href="" ng-click="sortField = \'uploader\'; reverse = !reverse">Uploader</a></th>'
															+ '<th ng-if="privilege.showFormUpload"><a href="" ng-click="sortField = \'date\'	; reverse = !reverse">Date Upload</a></th>'
															+ '<th>Action</th>'
														+ '</tr>'
													+ '</thead>'
                                                    + '<tbody>'
                                                        + '<tr ng-repeat="object in node.forms | filter:query |   orderBy:sortField:reverse track by $index">'
                                                            + '<td>{{ $index + 1 }}</td>'
                                                            + '<td>{{ object.description }}</td>'
                                                            //showing uploaded form detail
                                                            + '<td ng-if="privilege.showFormUpload">{{ object.uploads.users.name }}</td>'
															+ '<td ng-if="privilege.showFormUpload">{{ object.uploads.created_at | amDateFormat:\'DD-MM-YYYY HH:mm:ss\' }}</td>'
                                                            //show when editable node mode
                                                            + '<td ng-if="privilege.editableNode">'
                                                                + '<a ng-href="{{ $root.FILE_HOST }}/upload/form/{{ object.document }}" target="_blank" class="btn btn-info btn-xs"><i class="fa fa-arrow-down"></i></a>&nbsp;|&nbsp;'
                                                                + '<button popover="Update" popover-trigger="mouseenter" ng-click="updateNodeFormItem($index, node.forms, node)" class="btn btn-success btn-xs"><i class="fa fa-edit"></i></button>&nbsp;|&nbsp;'
                                                                + '<button popover="Delete" popover-trigger="mouseenter" ng-click="deleteNodeFormItem($index, node.forms)" class="btn btn-danger btn-xs"><i class="fa fa-close"></i></button>'
                                                            + '</td>'
                                                            
                                                            //cannot show details when creation or Modification
                                                            + '<td ng-if="!privilege.editableNode">'
                                                                //hide download master form when Delegation or user not delegate but shows when Assessment
                                                                + '<a ng-if="privilege.showFormMaster" ng-href="{{ $root.FILE_HOST }}/upload/form/{{ object.document }}" target="_blank" class="btn btn-info btn-xs" '
                                                                    + 'popover="Download Master Document" popover-trigger="mouseenter"><i class="fa fa-arrow-down"></i>'
                                                                + '</a>'
                                                                
                                                                //show detail when user delegate and when not Delegation and not Assessment
                                                                + '<span ng-if="privilege.editableFormUpload">&nbsp;|&nbsp;</span>'
                                                                + '<button ng-if="privilege.editableFormUpload" popover="Detail" popover-trigger="mouseenter" ng-click="detailForm(object.project_form_item_id)" class="btn btn-info btn-xs"><i class="fa fa-search"></i></button>'
                                                                
                                                                //show download last uploaded form when Assessment
                                                                + '<span ng-if="privilege.showFormUpload && object.uploads.upload">&nbsp;|&nbsp;</span>'
                                                                + '<a ng-if="privilege.showFormUpload && object.uploads.upload" ng-href="{{ $root.FILE_HOST }}/upload/project/{{ object.uploads.upload }}" target="_blank" class="btn btn-success btn-xs" '
                                                                    + 'popover="Download Submited Document" popover-trigger="mouseenter"><i class="fa fa-arrow-down"></i>'
                                                                + '</a>'
    
															+ '</td>'
                                                        + '</tr>'
                                                    + '</tbody>'
                                                + '</table>'
                                            + '</div>'
                                        + '</div>'
                                    + '</div>'
                                + '</div>' //end of form panel
                            + '</div>'
                        + '</div>'
                    + '</div>	'
    
                $element.append($scope.template);
    
                $compile($element.contents())($scope.$new());
            }
        }
    }




})();




