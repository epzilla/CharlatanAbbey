'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var paths = {
    app: ['./client/app/src/app.jsx'],
    js: ['./client/app/src/**/*.*'],
    scss: ['./client/app/styles/scss/**/*.scss'],
    img: ['./client/app/img/**/*']
};

gulp.task('sass', function () {
  gulp.src('./client/app/styles/scss/main.scss')
  .pipe(plumber())
  .pipe(sass({
    includePaths: ['scss']
  }))
  .pipe(autoprefixer({
    browsers: ['> 1%']
  }))
  .pipe(minifycss())
  .pipe(gulp.dest('client/app/styles'))
  /* Reload the browser CSS after every change */
  .pipe(reload({stream:true}));
});

gulp.task('browserify', function() {
    // Browserify/bundle the JS.
    browserify(paths.app)
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./client/app/build/'))
        .pipe(reload({stream: true}));
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init([paths.scss, paths.js, '*.html'], {
    proxy: 'http://localhost:9000',
    port: 4000
  });
});

gulp.task('nodemon', function(done){
  var called = false;
  nodemon({
    script: './server/app.js',
    env: { 'NODE_ENV': 'development'},
    nodeArgs: ['--debug']
  })
  .on('start', function onStart() {
    // ensure start only got called once
    if (!called) { done(); }
    called = true;
  })
  .on('restart', function () {
    // reload connected browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, 500);
  });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.js, ['browserify']);
    gulp.watch(['./client/app/styles/scss/*.scss'], ['sass']);
    /* Watch app.js file, run the scripts task on change. */
    // gulp.watch(['js/**/*.js'], ['bs-reload']);
    /* Watch .html files, run the bs-reload task on change. */
    gulp.watch(['*.html'], ['bs-reload']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['serve']);

gulp.task('serve', ['browserify', 'sass', 'nodemon', 'browser-sync', 'watch']);
