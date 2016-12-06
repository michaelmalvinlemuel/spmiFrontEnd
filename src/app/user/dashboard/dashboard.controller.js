(function (angular) {

	'use strict';

	angular.module('spmiFrontEnd')
		.controller('EndUserController',  EndUserController)

	function EndUserController ($scope, $state, $auth, filterFilter, CURRENT_USER, calendarConfig, pica) {
		var user = this;

		user.user = CURRENT_USER
		console.log(user.user);
		var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function(args) {
        alert.show('Edited', args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function(args) {
        alert.show('Deleted', args.calendarEvent);
      }
    }];

    user.onChange = function() {
      var filteredYear = user.yearMalvin;
      var dummy = [];

      for (var i = 0; i < user.eventsMonthly.length; i++) {
        if (user.eventsMonthly[i].year == filteredYear) {
          dummy.push(user.eventsMonthly[i]);
        }
      }

      user.eventsFiltered = dummy;
      //alert(user.yearMalvin);
    }

		user.viewDate = new Date();
		user.logout = function(){
			$auth.logout().then(function(){
				CURRENT_USER = {}
				$state.go('login', {sender: 'system'});
			}, function(response){})
		}

		user.calendarView = 'month';
		user.calendarDate = new Date();
		user.calendarTitle = 'testing';
		user.events = [];
    user.eventsMonthly = [];
    //console. log(Object.keys(pica).length)
    function filtered_color(endsAt,today){
      var diff = endsAt.diff(today,'days')
      if (diff < 0){
        return calendarConfig.colorTypes.inverse; 
      }
      if (diff >= 0 && diff < 5){
        return calendarConfig.colorTypes.important;
      }
      if (diff >= 5 && diff < 7 ){
        return calendarConfig.colorTypes.warning;
      }
      if (diff > 7){
        return  calendarConfig.colorTypes.info;
      }
    }

    function insertEvent(title,startsAt,endsAt,color,pic,pica,month){
      user.events.push({
        title: title,
        startsAt: startsAt,
        endsAt: endsAt,
        color: color,
        pic: pic,
        pica: pica
      });

      return user.events;
    }

    /*get pica which has detail*/

    for (var key in pica) {


        if (pica[key].pica_details){

              if (pica[key].pica_details.length > 0) {

                    for (var index = 0; index < pica[key].pica_details.length; index++) {

                        insertEvent(
                          pica[key].pica_details[index].rencana,
                          new Date(pica[key].pica_details[index].created_at),
                          new Date(moment(moment(new Date(pica[key].pica_details[index].expdate)).add(1,'days')).subtract(7,'hours')),
                          filtered_color(moment(moment(new Date(pica[key].pica_details[index].expdate)).add(1,'days')).subtract(7,'hours'),moment()),
                          pica[key].pica_details[index].user.name,
                          pica[key].project_node.description
                          );
                      }

              } 
              else {
                delete pica[key];
              }

        }  else {

             insertEvent(
              pica[key].rencana,
              new Date(pica[key].created_at),
              new Date(moment(moment(new Date(pica[key].expdate)).add(1,'days')).subtract(7,'hours')),
              filtered_color(moment(moment(new Date(pica[key].expdate)).add(1,'days')).subtract(7,'hours'),moment()),
              pica[key].user.name,
              pica[key].projectnode.description
              );
        }
      }
    var year = new Date().getFullYear();
    var maxyear =  year + 5;
    user.year = [];
    for (var i = year; i < maxyear; i++) {
      var newyear = i;
      user.year.push(newyear);  
    }
    user.months = ['January','February','march','april','may','june','july','august','september','october','november','december'];
    for (var index = 0; index < user.events.length; index++) {
      var monthnum = user.events[index].startsAt.getMonth();
      user.eventsMonthly.push({
        year : user.events[index].startsAt.getFullYear(),
        month : user.months[monthnum],
        title: user.events[index].title,
        startsAt: user.events[index].startsAt,
        endsAt: user.events[index].endsAt,
        pic: user.events[index].pic,
        color: filtered_color(moment(moment(new Date(user.events[index].endsAt)).add(1,'days')).subtract(7,'hours'),moment())
      });
    }
    $scope.bulan = function (item){
      for (var index = 0; index < user.months.length; index++) {
       if (item == user.months[index]){
         return $user.months[index];
       }
      }
    }

    $scope.getcount = function (bulan){
      return filterFilter(user.eventsFiltered,{month:bulan}).length;
    }
  	user.eventClicked = function (event) {
      $state.go('main.user.picadetail');
		}
		//user.calendarNewEventStart  =
		//user.calendarNewEventEnd =
		return user;
	}

})(angular);
