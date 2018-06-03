const gulp = require('gulp');
const args = require('yargs').argv;
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');
const util = require('gulp-util');
const sass = require('gulp-sass');
//const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const inject = require('gulp-inject');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const taskListing = require('gulp-task-listing');
const imagemin = require('gulp-imagemin');
const htmlMin = require('gulp-htmlmin');
const angularTemplatecache = require('gulp-angular-templatecache');
const useref = require('gulp-useref');
const csso = require('gulp-csso');
const filter = require('gulp-filter');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const bump = require('gulp-bump');
const path = require('path');
const _ = require('lodash');
const config = require('./gulp.config')();

const port = process.env.PORT || config.defaultPort;

gulp.task('list', taskListing);
gulp.task('default', ['list']);

gulp.task('vet', function() {
	log('Analyzing source with JSHint and JSCS');

	return gulp
		.src(config.all_js)
		.pipe(jscs())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
		//.pipe(jshint.reporter('fail')); <- Nie dziala, nie wiem czemu
});

gulp.task('sass', ['clean-styles'], function() {
	log('Compiling SCSS to CSS');

	return gulp
		.src(config.sass)
		//.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 3 versions', '> 5%']
		}))
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.css))
		//.pipe(browserSync.stream());
});

gulp.task('sass-watcher', function() {
	gulp.watch([config.sass], ['sass']);
});

gulp.task('fonts', ['clean-fonts'], function() {
	log('Copying fonts');

	return gulp
		.src(config.fonts)
		.pipe(gulp.dest(config.build + 'webfonts'));
});

gulp.task('images', ['clean-images'], function() {
	log('Copying and compressing images');

	return gulp
		.src(config.images)
		.pipe(imagemin({ optimizationLevel: 4 }))
		.pipe(gulp.dest(config.build + 'images'));
});

gulp.task('templateCache', ['clean-code'], function() {
	log('Creating AngularJS $templateCache');

	return gulp
		.src(config.htmlTemplates)
		.pipe(htmlMin({
			sortAttributes: true,
			sortClassName: true,
			collapseWhitespace: true
		}))
		.pipe(angularTemplatecache(
			config.templateCache.file,
			config.templateCache.options
		))
		.pipe(gulp.dest(config.temp));
});

gulp.task('clean', function() {
	let delConfig = config.build;
	log('Cleaning: ' + util.colors.blue(delConfig));
	del(delConfig);
});

gulp.task('clean-styles', function() {
	clean([
		config.css + '**/*.css',
		'!' + config.css + 'vendor/**/*.css'
	]);
});

gulp.task('clean-fonts', function() {
	clean(config.build + 'fonts');
});

gulp.task('clean-images', function() {
	clean(config.build + 'images');
});

gulp.task('clean-code', function() {
	let files = [].concat(
		config.build + '**/*.html',
		config.build + 'js'
	);
	clean(files);
});

gulp.task('wiredep', function() {
	log('Wire up the bower css, js and app js into the html');
	let options = config.getWiredepDefaultOptions();
	let wiredep = require('wiredep').stream;

	return gulp
		.src(config.index)
		.pipe(wiredep(options))
		.pipe(inject(gulp.src(config.js)))
		.pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'sass', 'templateCache'], function() {
	log('Wire up the app css into the html and call wiredep');

	return gulp
		.src(config.index)
		.pipe(inject(gulp.src(config.styles)))
		.pipe(gulp.dest(config.client));
});

gulp.task('optimize', ['inject'], function() {
	log('Optimizing the javascript, css, html');

	let templateCache = config.temp + config.templateCache.file;
	let cssFilter = filter('**/*.css', { restore: true });
	let jsLibFilter = filter('**/*.lib.js', { restore: true });
	let jsAppFilter = filter('**/*.app.js', { restore: true });

	return gulp
		.src(config.index)
		.pipe(inject(gulp.src(templateCache, {read:false}), {
			starttag: '<!-- inject:templates:js -->'
		}))
		.pipe(useref({ searchPath: './' }))
		.pipe(cssFilter)
		.pipe(csso())
		.pipe(cssFilter.restore)
		.pipe(jsLibFilter)
		.pipe(uglify())
		.pipe(jsLibFilter.restore)
		.pipe(jsAppFilter)
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(jsAppFilter.restore)
		.pipe(gulp.dest(config.build));
});

gulp.task('build', ['optimize', 'images', 'fonts'], function() {
	log('Building everything');

	let msg = {
		title: 'gulp build',
		subtitle: 'Deployed to the build folder',
		message: 'Running gulp serve-build'
	};

	del(config.temp);
	log(msg);
	notify(msg);
});

gulp.task('serve-dev', ['inject'], function() {
	serve(true /* isDev */);
});

gulp.task('serve-build', ['build'], function() {
	serve(false /* isDev */);
});

/*
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or not flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --ver=1.2.3 will bump to a specific version and ignore other flags
*/
gulp.task('bump', function() {
	let msg = 'Bumping version';
	let type = args.type;
	let version = args.ver;
	let options = {};
	if (version) {
		options.version = version;
		msg += ' to ' + version;
	} else {
		options.type = type;
		msg += ' for a ' + type;
	}
	log(msg);

	return gulp
		.src(config.packages)
		.pipe(bump(options))
		.pipe(gulp.dest(config.root));
});


function serve(isDev) {
	let options = {
		script: config.nodeServer,
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV': isDev ? 'development' : 'build'
		},
		watch: [config.server]
	};

	return nodemon(options)
		.on('start', function() {
			log('*** Nodemon started ***');
			startBrowserSync(isDev);
		})
		.on('restart', function(event) {
			log('*** Nodemon restarted ***');
			log('Files changed on restart:\n' + event);
			setTimeout(function() {
				browserSync.notify('Reloading now...');
				browserSync.reload({ stream: false });
			}, config.browserReloadDelay);
		})
		.on('crash', function() {
			log('*** Nodemon crashed: script crashed for some reason ***');
		})
		.on('exit', function() {
			log('*** Nodemon exited cleanly ***');
		});
}

function startBrowserSync(isDev) {
	if (args.nosync || browserSync.active) { // gulp serve-dev --nosync <- prevent opening new tab
		return;
	}

	log('Starting browser-sync on port: ' + port);

	if (isDev)
		gulp.watch([config.sass], ['sass']);
	else
		gulp.watch([config.sass, config.js, config.html], ['optimize', browserSync.reload]);

	let options = {
		proxy: 'localhost:' + port,
		port: 3000,
		files: isDev ? [
			config.client + '**/*.*',
			'!' + config.sass,
			config.css + '**/*.css'
		] : [],
		ghostMode: {
			clicks: true,
			location: true,
			forms: true,
			scroll: true
		},
		injectChanges: true,
		logFileChanges: true,
		logLevel: 'debug',
		logPrefix: 'gulp-patterns',
		notify: true,
		reloadDelay: 1000
	};

	browserSync(options);
}

function clean(path) {
	log('Cleaning: ' + util.colors.blue(path));
	del(path);
}

function log(msg) {
	if (typeof(msg) === 'object') {
		for (let item in msg) {
			if (msg.hasOwnProperty(item)) {
				util.log(util.colors.blue(msg[item]));
			}
		}
	} else {
		util.log(util.colors.blue(msg));
	}
}

function notify(options) {
	let notifier = require('node-notifier');
	let notifyOptions = {
		sound: 'Bottle',
		contentImage: path.join(__dirname, 'gulp.png'),
		icon: path.join(__dirname, 'gulp.png')
	};
	_.assign(notifyOptions, options);
	notifier.notify(notifyOptions);
}