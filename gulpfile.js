'use strict';

var autoprefixPlugin = require('less-plugin-autoprefix');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var oauth = require('reddit-oauth');
var moment = require('moment');
var Q = require('q');

var config = require('./gulp-config.js');

var paths = {
	less: 'source/stylesheet/**/*.less',
	stylesheet: 'source/stylesheet/bluejays.less',
	css: 'dist/bluejays.css'
};

var autoprefix = new autoprefixPlugin({ browsers: ['last 2 versions'] });

var reddit = new oauth({
	app_id: config.app_id,
	app_secret: config.app_secret
});

function sendStylesheet(isSuccess, deferred) {
	if (isSuccess) {
		var path = '/r/' + config.subreddit + '/api/subreddit_stylesheet';
		var params = {
			api_type: 'json',
			op: 'save',
			reason: 'Automatic deployment: ' + moment().format('MMM D YYYY, h:mm:ss a')
		};

		fs.readFile(paths.css, 'utf-8', function (error, data) {
			if (error) {
				console.log(error);
			} else {
				params.stylesheet_contents = data;
				gutil.log('Uploading stylesheet...');
				reddit.post(path, params, function (error, response, body) {
					if (body) {
						var data = JSON.parse(body).json;

						if (data.errors && data.errors.length > 0) {
							gutil.log(data);
						}
					}

					deferred.resolve();
				});
			}
		});
	} else {
		gutil.log('Uploading stylesheet...');
		deferred.resolve();
	}
}

gulp.task('deploy', ['less'], function () {
	var deferred = Q.defer();

	if (reddit.access_token) {
		sendStylesheet(true, deferred);
	} else {
		gutil.log('Logging in...');
		reddit.passAuth(config.username, config.password, function (isSuccess) {
			sendStylesheet(isSuccess, deferred);
		});
	}

	return deferred.promise;
});

gulp.task('less', function () {
	return gulp.src([paths.stylesheet])
		.pipe(less({
			plugins: [autoprefix],
			compress: false
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	gulp.watch(paths.less, ['less', 'deploy']);
});

gulp.task('default', ['deploy', 'watch']);