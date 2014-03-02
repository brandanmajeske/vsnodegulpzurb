var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var sass = require('gulp-ruby-sass');
var _if = require('gulp-if');
var isWindows = /^win/.test(require('os').platform());
var lr;
var EXPRESS_PORT = 8080;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;

console.log("Is it Windows? " + isWindows);

function startLiveReload(){
	lr = require('tiny-lr')();
	lr.listen(LIVERELOAD_PORT);
}

function startExpress() {
	var express = require('express');
	var app = express();
	app.use(require('connect-livereload')());
	app.use(express.static(EXPRESS_ROOT));
	app.listen(EXPRESS_PORT);
	console.log('listening on port ' + EXPRESS_PORT);
}

function notifyLiveReload(event) {
	var fileName = require('path').relative(EXPRESS_ROOT, event.path);
	
	lr.changed({
		body: {
			files: [fileName]
		}
	});	
}

/*
gulp.task('css', function(){
	return gulp.src('sass/main.scss')
		.pipe(sass({style: 'compressed'}))
		.pipe(autoprefixer('last 15 versions'))
		.pipe(gulp.dest('css'))
		.pipe(notify({ message: 'That\'s All Folks!'}));
});*/


function reload(sass,autoprefixer,notify){
	return gulp.src('sass/main.scss')
		.pipe(sass({style: 'compressed'}))
		.pipe(autoprefixer('last 15 versions'))
		.pipe(gulp.dest('css'))
		.pipe(_if(!isWindows, notify({ message: 'That\'s All Folks!'})));
}

gulp.task('default', function(){
	startExpress();
	startLiveReload();
	reload(sass,autoprefixer,notify);
	gulp.watch('*.html', notifyLiveReload);
	gulp.watch('css/*.css', notifyLiveReload);

	gulp.watch('sass/**/*.scss', function(){
		return reload(sass,autoprefixer,notify);
	});
});