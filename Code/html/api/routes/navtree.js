module.exports = function(server, db) {
	server.get(apiPrefix + '/navtree', function (req, res, next) {
		switch (req.user.role) {
			case 1: // Student
				res.json({
					expanded: true,
					children: [
						{
							text: 'Home',
							iconCls: 'x-fa fa-home',
							viewType: 'studenthome',
							routeId: 'home', // routeId defaults to viewType
							leaf: true
						},
						{
							text: 'Event Map',
							iconCls: 'x-fa fa-map-marker',
							viewType: 'eventmap',
							routeId: 'map',
							leaf: true
						}
					]
				});
				break;
			case 2: // Judge
				res.json({
					expanded: true,
					children: [
						{
							text: 'Home',
							iconCls: 'x-fa fa-home',
							viewType: 'judgehome',
							routeId: 'home',
							leaf: true
						},
						{
							text: 'Event Map',
							iconCls: 'x-fa fa-map-marker',
							viewType: 'eventmap',
							routeId: 'map',
							leaf: true
						}
					]
				});
				break;
			case 3: // Admin
				res.json({
					expanded: true,
					children: [
						{
							text: 'Home',
							iconCls: 'x-fa fa-home',
							viewType: 'adminhome',
							routeId: 'home',
							leaf: true
						},
						{
							text: 'Event Map',
							iconCls: 'x-fa fa-map-marker',
							viewType: 'eventmap',
							routeId: 'map',
							leaf: true
						},
						{
							text: 'Email',
							iconCls: 'x-fa fa-send',
							rowCls: 'nav-tree-badge nav-tree-badge-hot',
							routeId: 'email',
							leaf: true
						},
						{
							text: 'People',
							iconCls: 'x-fa fa-group',
							routeId: 'people',
							leaf: true
						},
						{
							text: 'Grades',
							iconCls: 'x-fa fa-book',
							viewType: 'grade', 
							routeId: 'grade',
							leaf: true
						},
						{
							text: 'Stats',
							iconCls: 'x-fa fa-bar-chart',
							viewType: 'pageblank', //'charts',
							routeId: 'stats',
							leaf: true
						},
						{
							text: 'Settings',
							iconCls: 'x-fa fa-gears',
							rowCls: 'nav-tree-badge nav-tree-badge-new',
							routeId: 'settings',
							leaf: true
						}
					]
				});
				break;
		}

		return next();
	});
};
