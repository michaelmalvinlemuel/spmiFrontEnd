(function() {
	
	'use strict'
	
	angular.module('spmiFrontEnd')
		.factory('ProjectConverterService', ProjectConverterService)
		
	
	function ProjectConverterService(CURRENT_USER) {
		
		var converter = {}
		
		converter.filterDelegationsNode = function(nodes) {
			var node = [];
			
			var recursiveFilter = function(nodes) {
				
				for (var i = 0; i < nodes.length; i++) {
					
					
					var counter = 0;
					for (var j = 0 ; j < nodes[i].delegations.length; j++) {
						if (nodes[i].delegations[j].id == CURRENT_USER.id) {
							node.push(nodes[i]);
							break;
						}
						counter++;
					}
					
					if (counter == nodes[i].delegations.length) {
						recursiveFilter(nodes[i].children);
					}
				}
				
			}
			
			recursiveFilter(nodes);
			
			return node;
		}
		
		converter.filterAssessorsNode = function(nodes) {
			var node = [];
			
			var recursiveFilter = function(nodes) {
				
				for (var i = 0; i < nodes.length; i++) {
					
					
					var counter = 0;
					for (var j = 0 ; j < nodes[i].assessors.length; j++) {
						if (nodes[i].assessors[j].id == CURRENT_USER.id) {
							node.push(nodes[i]);
							break;
						}
						counter++;
					}
					
					if (counter == nodes[i].assessors.length) {
						recursiveFilter(nodes[i].children);
					}
				}
				
			}
			
			recursiveFilter(nodes);
			
			return node;
		}
		
		converter.fixedNumberingConverter = function(nodes) {
			
			var recursiveNode = function(nodes) {
				
				for (var i = 0; i < nodes.length; i++) {
					
					if (nodes[i].parentFixedIndex) {
						nodes[i].fixedIndex = nodes[i].parentFixedIndex + (i + 1) + '.'
					} else {
						nodes[i].fixedIndex = (i + 1) + '.'
					}
					
					if (nodes[i].children.length > 0) {
						
						for(var j = 0; j < nodes[i].children.length; j++) {
							nodes[i].children[j].parentFixedIndex = nodes[i].fixedIndex;
						}
						
						recursiveNode(nodes[i].children);
						
					}
					
				}
			}
			
			recursiveNode(nodes);
			
		}
		
		
		converter.calculateResource = function(input) {
			
			var projects = input.projects,
				counter = 0,
				resources = []
				
			var counting = function (delegations) {
				
				for ( var i = 0; i < delegations.length; i++ ) {
					
					if ( resources.length > 0 ) {
						
						counter = 0;
						for ( var j = 0; j < resources.length; j++ ) {
							
							if (resources[j].label == delegations[i].name) {
								resources[j].data += 1;
								break;
							}
							
							counter++;
							
						}
						
						if ( counter == resources.length ) {
							console.log(counter)
							resources.push({data: 1, label: delegations[i].name})
						}
						
					} else {
						
						resources.push({data: 1, label: delegations[i].name})
						
					}
					
				}
				
			}
			
			var sourcing = function (nodes) {
				
				for (var i = 0; i < nodes.length; i++) {
					
					if (nodes[i].children.length > 0) {
						
						sourcing(nodes[i].children);
						
					} else {
						
						counting(nodes[i].delegations);
						
					}
					
				}
				
			} 
			
			sourcing(projects);	
			
			return resources;
			
			
			
		}
		
		converter.lockConverter = function(input) {
			
			var recuring = function(node) {
				
				var childLock = 0;
				
				for (var i = 0; i < node.children.length; i++) {
					
					if (node.children[i].lock) {
						//console.log(node.children[i].lock);
					} else {
						node.children[i].lock = recuring(node.children[i]);
					}
					
					childLock += node.children[i].lock;
				}
				
				if (node.children.length == 0) {
					return node.lock;
				} else if (childLock == node.children.length) {
					node.lock = 1;
				} else {
					node.lock = 0;
				}
				
				return node.lock;
			}
			
			var nodeLock = 0;
			for (var i = 0; i < input.projects.length; i++) {
				
				//check if lock is exsist;
				if (input.projects[i].lock) {
					
					//temporary counter for comparing if all children are locked
					var childLock = 0;
					for (var j = 0; j < input.projects[i].children.length; j++) {
						
						if (input.projects[i].children[j].lock) {

						} else {
							input.projects[i].children[j].lock = recuring(input.projects[i].children[j])
						}
						
						childLock += input.projects[i].children[j].lock;
					}
					
					//if all children is locking
					if (childLock == input.projects[i].children.length) {
						input.projects[i].lock = 1;
					} else {
						input.projects[i].lock = 0;
					}
					
				} else {
					
					input.projects[i].lock = recuring(input.projects[i]);
					
				}
				
				nodeLock += input.projects[i].lock;
			}
			
			if (nodeLock == input.projects.length) {
				input.lock = 1;
			} else {
				input.lock = 0;
			}
			
		}
		
		converter.statusConverter = function(input) {
			
			//console.log(input);
			var now = new Date();
			
			var start = new Date(input.start);
			var ended = new Date(input.ended);
			
			if (input.status == 0) {
				return {
					code: 0,
					text : 'Pending',
				}
			}
			
			if (start > now && input.status == 1) {
				return {
					code: 1,
					text : 'Preparation',
				}
			}
			
			if (start <= now && ended >= now && input.status == 1) {
				return { 
					code: 2,
					text: 'On Progress',
				}
			}
			
			if (ended < now && input.status == 1) {
				return {
					code: 3,
					text: 'Waiting for Scoring',
				};
			}
			
			if (input.status == 2) {
				return {
					code: 4,
					text: 'Completed',
				};
			}
			
			if (input.status == 3) {
				return {
					code: 5,
					text: 'Terminated',
				};
			}
		}
		
		converter.decimalConverter = function(nodes) {
			for ( var i = 0; i < nodes.length; i++ ) {
				if(angular.isArray(nodes[i].children)) {
					if (nodes[i].children.length > 0) {
						converter.decimalConverter(nodes[i].children);
					} else {
						nodes[i].weight = Number(nodes[i].weight);
					}
				} else {
					nodes[i].children = []
				}
			}
		};
		
		converter.dateConverter = function(object) {
			object.start = new Date(object.date_start);
			object.ended = new Date(object.date_ended);
		};
		
		converter.userConverter = function(input) {
			for (var i = 0 ; i < input.users.length ; i++){
				delete input.users[i].pivot;
				input.users[i].check = true;	
			}
			
			for (var i = 0 ; i < input.assessors.length ; i++){
				delete input.assessors[i].pivot;
				input.assessors[i].check = true;	
			}
		}
		
		converter.validateCheckpoint = function(input) {
			var msg = {},
				leader;
				
			msg.general = [];
			
			if (input.users.length == 0) {
				//msg.general.push('Project ini harus terdiri dari user')
			} else {
				var counter = 0
				for(var i = 0 ; i < input.users.length ; i++) {
					if (input.users[i].leader == true) {
						leader = input.users[i]
						break;
					}
					counter++
				}
	
				if (counter == input.users.length) {
					//msg.general.push('Project ini harus memiliki Pimpro');
				}
			}
			
			if (input.assessors.length == 0) {
				//msg.general.push('Project ini harus memiliki assessors');
			}
			
			return msg;
		};
		
		
		converter.dateScoreConverter = function(node) {
			for (var i = 0; i < node.forms.forms.length; i++) {
				if (node.forms.forms[i].upload) {
					node.forms.forms[i].upload.created_at = new Date(node.forms.forms[i].upload.created_at);
					node.forms.forms[i].upload.updated_at = new Date(node.forms.forms[i].upload.updated_at);
				}
			}	
			
			for (var i = 0; i < node.forms.scores.length; i++) {
				node.forms.scores[i].created_at = new Date(node.forms.scores[i].created_at)
				node.forms.scores[i].updated_at = new Date(node.forms.scores[i].updated_at)
			}
		};
		
		
		
		converter.calculateScore = function(nodes) {
			
			for (var i = 0; i < nodes.length; i++) {
				
				
				//if(!typeof nodes[i].score)
				if (typeof nodes[i].weight === "undefined" && typeof nodes[i].score === "undefined") {
					
					var counter = 0;
					var totalWeight = 0;
					var totalScore = 0;
					
					for (var j = 0; j < nodes[i].children.length; j++) {
						
						if (typeof nodes[i].children[j].weight !== "undefined" && typeof nodes[i].children[j].score !== "undefined") {
							totalWeight += nodes[i].children[j].weight;
						
							if (nodes[i].children[j].score !== null) {
								totalScore += nodes[i].children[j].score.score * nodes[i].children[j].weight;	
							} else {
								totalScore += 0;
							}
							
							counter++;
							
						} else {
							nodes[i].score = {}
							nodes[i].score.score = 0;
							break;
						}
					}
					
					if (counter == nodes[i].children.length) {
						nodes[i].weight = totalWeight;
						nodes[i].score = {}
						nodes[i].score.score = totalScore / totalWeight;
				
					} else {
						converter.calculateScore(nodes[i].children);
						converter.calculateScore(nodes);
				
					}
				}
			}
		};
		
		converter.calculateNodeScore = function(node) {
			
			var totalWeight = 0;
			var totalScore = 0;
					
			for (var i = 0; i < node.children.length; i++) {
				
		
				if (typeof node.children[i].weight !== "undefined" && typeof node.children[i].score !== "undefined") {
					
					totalWeight += node.children[i].weight;
					if (node.children[i].score !== null) {
						totalScore += node.children[i].score.score * node.children[i].weight;
					} 
					
					
				} else {
					
					totalScore += converter.calculateNodeScore(node.children[i]);
					
				}
				
			}
			
			return totalScore/totalWeight;
		}
		
		converter.validateSubmit = function(input) {
			
			var msg = {},
				weight = 0,
				leader = {};
				
			msg.general = []
			msg.noChild = []
			msg.noAssessors = []
			msg.noForm = []
			msg.noWeight = []
				
			if (input.users.length == 0) {
				msg.general.push('Project ini harus terdiri dari user')
			} else {
				var counter = 0;
				for(var i = 0 ; i < input.users.length ; i++) {
					if (input.users[i].leader == true) {
						leader = input.users[i];
						break;
					}
					counter++
				}
	
				if (counter == input.users.length) {
					msg.general.push('Project ini harus memiliki Pimpro');
				}
			}
			
			if (input.assessors.length == 0) {
				msg.general.push('Project ini harus memiliki assessors');
			}
	
			if (input.projects.length == 0) {
				msg.general.push('Project ini harus memiliki pekerjaan');
			};
			
			var pushLeader = function(node) {
				var counter = 0;
				for(var j = 0 ; j < node.delegations.length ; j++) {
					if (node.delegations[j].id == leader.id) {
						//do not push if leader already on delegation list
						break;
					}
					counter++;
				}
				
				//push if leader not on delegation list
				if (counter == node.delegations.length) {
					node.delegations.push(leader);
				}
			}
			
			var nodeChecking = function(nodes) {
				for (var i = 0 ; i < nodes.length ; i++) {
					//check if has children
					if (nodes[i].children.length > 0) {
						
						//push leader to delegation
						pushLeader(nodes[i]);
	
						nodeChecking(nodes[i].children);
	
					} else {
						//check if has form collection
						if (nodes[i].forms) {
							
							//checking form item
							if (nodes[i].forms.length == 0) {
								msg.noForm.push('Butir "' + nodes[i].index + nodes[i].header + '" harus memiliki minimal satu form');
							}
							
							if (nodes[i].weight) {	
								//if weight is zero and more than 100
								if (nodes[i].weight !== 0 && nodes[i].weight <= 100) {
									weight += nodes[i].weight;
									
                                    //console.log(weight);
                                    
								} else {
									msg.noWeight.push('Butir "' + nodes[i].index + nodes[i].header + '" harus memiliki bobot lebih besar dari 0');
								}
								
								//push leader to delegation;
								pushLeader(nodes[i]);
	
							} else {
								//if has no weight
								msg.noWeight.push('Butir "' + nodes[i].index + nodes[i].header + '" harus ditentukan bobot pekerjaan')
							}
							
							//if node has no assessors
							if (nodes[i].assessors.length == 0) {
								msg.noAssessors.push('Butir "' + nodes[i].index + nodes[i].header + '" harus memiliki assessors minimal satu assessors');
							}
								
						} else {
							//if not have form collection and children
							msg.noChild.push('Butir "' + nodes[i].index + nodes[i].header + '" harus memiliki child atau form')
						}
					}
				}
			}
			
			nodeChecking(input.projects)
			
			/*
			if (weight !== 100) {
				msg.general.push('Bobot project ini tidak sama dengan 100 (' + weight + ')')
			}
			*/
			
			return msg;
		};
		
		
		converter.validateTemplateSubmit = function(input) {
			
			var msg = {},
				weight = 0;
				
			msg.general = []
			msg.noChild = []
			msg.noAssessors = []
			msg.noForm = []
			msg.noWeight = []
				
	
			if (input.projects.length == 0) {
				msg.general.push('Project ini harus memiliki pekerjaan');
			}

			var nodeChecking = function(nodes) {
				for (var i = 0 ; i < nodes.length ; i++) {
					//check if has children
					if (nodes[i].children.length > 0) {
						nodeChecking(nodes[i].children);
					} else {
						//check if has form collection
						if (nodes[i].forms) {
							//checking form item
							if (nodes[i].forms.length == 0) {
								msg.noForm.push('Butir "' + nodes[i].fixedIndex + '. ' + nodes[i].header + '" harus memiliki minimal satu form');
							}
							
							if (nodes[i].weight) {	
								//if weight is zero and more than 100
								if (nodes[i].weight !== 0 && nodes[i].weight <= 100) {
									weight += nodes[i].weight;
								} else {
									msg.noWeight.push('Butir "' + nodes[i].fixedIndex + '. ' + nodes[i].header + '" harus memiliki bobot lebih besar dari 0');
								}
							} else {
								//if has no weight
								msg.noWeight.push('Butir "' + nodes[i].fixedIndex + '. ' + nodes[i].header + '" harus ditentukan bobot pekerjaan')
							}
						} else {
							//if not have form collection and children
							msg.noChild.push('Butir "' + nodes[i].fixedIndex + '. ' + nodes[i].header + '" harus memiliki child atau form')
						}
					}
				}
			}
			
			nodeChecking(input.projects);
			
			/*
				if (weight !== 100) {
					msg.general.push('Bobot project ini tidak sama dengan 100 (' + weight + ')')
				}
			*/
			
			return msg;
		};
		
		return converter;
	}
})();