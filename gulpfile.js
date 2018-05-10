'use strict';

let config = require('./src/config.json');
let browserSync = require('browser-sync').create();
let gulp = require('gulp');
let glob = require('gulp-sass-glob');
let notify = require('gulp-notify');
let sourceMaps = require('gulp-sourcemaps');
let plumber = require('gulp-plumber');
let sass = require('gulp-sass');

// CSS.
gulp.task('css', function () {
  return gulp.src(config.css.src)
    .pipe(glob())
    .pipe(plumber({
      errorHandler: function (error) {
        notify.onError({
          title: "Gulp",
          subtitle: "Failure!",
          message: "Error: <%= error.message %>",
          sound: "Beep"
        })(error);
        this.emit('end');
      }
    }))
    .pipe(sourceMaps.init())
    .pipe(sass({
      style: 'compressed',
      errLogToConsole: true,
      includePaths: config.css.includePaths
    }))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(config.css.dest))
    .pipe(browserSync.reload({stream: true, match: '**/*.css'}))
});

// Watch task.
gulp.task('watch', function () {
  gulp.watch(config.css.src, ['css']);
});

gulp.task('default', ['watch']);