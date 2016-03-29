'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var browserify = require('browserify');
var babelify = require('babelify');
var del = require('del');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var usemin = require('gulp-usemin');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var reload = browserSync.reload;

var paths = {
  app: ['./client/app/src/app.jsx'],
  js: ['./client/app/src/**/*.*'],
  index: ['./client/index.html'],
  scss: ['./client/app/styles/scss/**/*.scss'],
  img: ['./client/img/**/*'],
  node: ['./server/**/*']
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

gulp.task('browserify', function () {
  // Browserify/bundle the JS.
  browserify(paths.app)
    .transform(babelify, {presets: ['es2015', 'react']})
    .bundle()
    .on('error', function (err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./client/app/build/'))
    .pipe(reload({stream: true}));
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init([paths.scss, paths.js, '*.html'], {
    proxy: 'http://localhost:9000',
    port: 4000
  });
});

gulp.task('nodemon', function (done){
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
gulp.task('watch', function () {
  gulp.watch(paths.js, ['browserify']);
  gulp.watch(['./client/app/styles/scss/*.scss'], ['sass']);
  /* Watch app.js file, run the scripts task on change. */
  // gulp.watch(['js/**/*.js'], ['bs-reload']);
  /* Watch .html files, run the bs-reload task on change. */
  gulp.watch(['*.html'], ['bs-reload']);
});

/**
 * BUILD STUFF
 */

gulp.task('usemin', function () {
  gulp.src(paths.index)
    .pipe(usemin({
      js: [uglify()]
    }))
    .pipe(gulp.dest('./build/'));

  gulp.src('./build/app/index.html')
    .pipe(gulp.dest('./build'));

  return del([
    './build/app/index.html',
    './build/app/fastclick.js',
    './build/app/bundle.js'
  ]);
});

gulp.task('node-build', function () {
  return gulp.src(paths.node)
    .pipe(gulp.dest('./build'));
});

gulp.task('js-build', function () {
  // Browserify/bundle the JS.
  return browserify(paths.app)
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/app'));
});

gulp.task('misc-copy', function () {
  gulp.src('./client/app/src/fastclick.js')
    .pipe(gulp.dest('./build/app'));

  gulp.src('./client/app/fonts/**')
    .pipe(gulp.dest('./build/app/fonts'));

  gulp.src('./client/app/styles/main.css')
    .pipe(gulp.dest('./build/app/styles'));

  gulp.src('./Procfile')
    .pipe(gulp.dest('./build'));

  return gulp.src('./package.json')
    .pipe(gulp.dest('./build'));
});

gulp.task('img-build', function () {
  return gulp.src(paths.img)
    .pipe(imagemin())
    .pipe(gulp.dest('./build/img'));
});

gulp.task('html-build', function () {
  return gulp.src(paths.index)
    .pipe(gulp.dest('./build'));
});

gulp.task('clean', function () {
  return del([
    './build.**',
    '!./build/.git'
  ]);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['serve']);

gulp.task('serve', ['browserify', 'sass', 'nodemon', 'browser-sync', 'watch']);

gulp.task('build', function () {
  runSequence(
    'clean',
    ['node-build', 'js-build', 'img-build', 'html-build', 'misc-copy'],
    'usemin'
  );
});
