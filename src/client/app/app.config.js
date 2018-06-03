(function () {
'use strict';

	angular
		.module('app')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

	function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
		
		$stateProvider
			.state('mainSite', {
			  	templateUrl: 'app/main-site/layout/layout.html',
                controller: 'navigationController',
                controllerAs: 'vm',
			  	abstract: true
			})
				.state('mainSite.home', {
					url: '/',
				  	templateUrl: 'app/main-site/home/home.html',
					controller: 'homeController',
					controllerAs: 'vm'
                })
                .state('mainSite.post', {
                    url: '/post/:id',
                    templateUrl: 'app/main-site/home/post.html',
                    controller: 'postController',
                    controllerAs: 'vm'
                })
				.state('mainSite.about', {
					url: '/about',
					templateUrl: 'app/main-site/about/about.html',
					controller: 'aboutController',
					controllerAs: 'vm'
				})
				.state('mainSite.contact', {
					url: '/contact',
					templateUrl: 'app/main-site/contact/contact.html',
					controller: 'contactController',
					controllerAs: 'vm'
				})
			.state('adminPanel', {
				url: '/admin-panel',
				templateUrl: 'app/admin-panel/layout/layout.html',
				controller: 'adminPanel/navigationController',
				abstract: true,
				resolve: { isAdminAuthenticated: isAdminAuthenticated }
			})
				.state('adminPanel.main', {
					url: '/main',
					templateUrl: 'app/admin-panel/main/main.html',
					controller: 'adminPanel/mainController',
					controllerAs: 'vm'
                })
                .state('adminPanel.posts', {
					url: '/posts',
					abstract: true
				})
					.state('adminPanel.posts.list', {
						url: '/list',
						templateUrl: 'app/admin-panel/posts/posts.html',
						controller: 'adminPanel/postsController',
						controllerAs: 'vm'
					})
					.state('adminPanel.posts.details', {
						url: '/:id',
						templateUrl: 'app/admin-panel/posts/postDetails.html',
						controller: 'adminPanel/postDetailsController',
						controllerAs: 'vm'
                    })
				.state('adminPanel.account', {
					url: '/account',
					templateUrl: 'app/admin-panel/account/account.html',
					controller: 'adminPanel/accountController',
					controllerAs: 'vm'
				})
				
		$urlRouterProvider.when('/admin-panel', '/admin-panel/main');
		$urlRouterProvider.otherwise('/');

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('');
	}

	isAdminAuthenticated.$inject = ['$state'];

    function isAdminAuthenticated($state) {
		console.log("isAdminAuthenticated");
		//$state.go('main');
	}
}());