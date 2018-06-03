module.exports = function() {
	let client = './src/client/';
	let app = client + 'app/';
	let report = './report';
	let root = './';
	let server = './src/server/';
	let temp = './.tmp/';

	let wiredep = require('wiredep');
	let bowerFiles = wiredep({devDependencies: true})['js'];

	let config = {
		/*
		*	Files paths
		*/
		all_js: [
			'./src/**/*.js',
			'./*.js'
		],
		build: './build/',
		client: client,
		index: client + 'index.html',
		js: [
			app + '**/*.module.js',
			app + '**/*.js'
		],
		
		sass: client + 'styles/scss/**/*.scss',
		css: client + 'styles/css/',
		styles: client + 'styles/css/**/*.css',
		fonts: [
			'./bower_components/font-awesome/web-fonts-with-css/webfonts/**/*.*',
            './bower_components/slick-carousel/slick/fonts/**/*.*',
            client + 'webfonts/**/*.*'
		],
		html: app + '**/*.html',
		htmlTemplates: app + '**/*.html',
		images: client + 'images/**/*.*',
		root: root,
		server: server,
		temp: temp,

		/*
		*	Template cache
		*/
		templateCache: {
			file: 'templates.js',
			options: {
				module: 'app',
				standAlone: false,
				root: 'app/'
			}
		},

		/*
		*	Browser sync
		*/
		browserReloadDelay: 1000,

		/*
		*	Bower and NPM locations
		*/
		bower: {
			json: require('./bower.json'),
			directory: './bower_components',
			ignorePath: '../..'
		},
		packages: [
			'./package.json',
			'./bower.json'
		],

		/*
		*	Node settings
		*/	
		defaultPort: 7203,
		nodeServer: './src/server/app.js'
	};

	config.getWiredepDefaultOptions = function() {
		return {
			bowerJson: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath
		};
	};

	return config;
};