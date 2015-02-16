var gulp = require('gulp');
var plumber = require('gulp-plumber');
var shell = require('gulp-shell');
var notify = require("gulp-notify");

var paths = {
  lib: 'lib/**/*.js',
  tests: 'tests/**/*.js',
  test: 'tests/index.js'
}

gulp.task('exec-tests', function () {
  gulp.src(paths.test, {read: false})
    .pipe(plumber({
      errorHandler: function() {
        notify('Tests failed');
      }
    }))
    .pipe(shell([ 'npm run tape' ]))
    .pipe(notify('Tests passed'))
});

gulp.task('autotest', ['exec-tests'], function() {
  gulp.watch([paths.lib, paths.tests], ['exec-tests']);
});
