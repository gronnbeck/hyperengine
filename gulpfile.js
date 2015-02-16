var gulp = require('gulp');
var shell = require('gulp-shell');
var notify = require("gulp-notify");

gulp.task('exec-tests', shell.task([
  'npm run tape',
]));

gulp.task('autotest', ['exec-tests'], function() {
  gulp.watch(['lib/**/*.js', 'tests/**/*.js'], ['exec-tests']);
});
