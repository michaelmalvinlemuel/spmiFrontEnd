(function (angular) {

	'use strict';

	angular.module('spmiFrontEnd')
		.controller('EndUserController',  EndUserController)

	function EndUserController ($state, $auth, CURRENT_USER, calendarConfig, calendar) {
		var user = this;

		user.user = CURRENT_USER

		user.calendar = calendar;
		
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
		user.events = [
      {
        title: 'An event',
        color: calendarConfig.colorTypes.warning,
        startsAt: moment().startOf('week').add(8, 'hours').toDate(),
        endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
        draggable: true,
        resizable: true,
        actions: actions
      }, {
        title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
        color: calendarConfig.colorTypes.info,
        startsAt: moment().subtract(1, 'day').toDate(),
        endsAt: moment().add(5, 'days').toDate(),
        draggable: true,
        resizable: true,
        actions: actions
      }, {
        title: 'This is a really long event title that occurs on every year',
        color: calendarConfig.colorTypes.important,
        startsAt: moment().startOf('day').add(7, 'hours').toDate(),
        endsAt: moment().startOf('day').add(19, 'hours').toDate(),
        recursOn: 'year',
        draggable: true,
        resizable: true,
        actions: actions
      }
    ];
		user.eventClicked = function (event) {

		}
		//user.calendarNewEventStart  =
		//user.calendarNewEventEnd =
		return user;
	}

})(angular);
