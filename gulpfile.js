var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');

var paths = {
  scss: './sass/*.scss'
};

gulp.task('scripts', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'js/vendor/jquery-1.11.1.js',
    'js/app.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

gulp.task('sass', function () {
  gulp.src('scss/main.scss')
  .pipe(plumber())
  .pipe(sass({
    includePaths: ['scss']
  }))
  .pipe(gulp.dest('css'))
  .pipe(autoprefixer({
    browsers: ['> 1%']
  }))
  .pipe(minifycss())
  .pipe(gulp.dest('css'))
  /* Reload the browser CSS after every change */
  .pipe(reload({stream:true}));
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(['css/*.css', 'js/*.js', '*.html'], {
    proxy: 'http://localhost:3000',
    port: 4000
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'server.js',
    nodeArgs: ['--debug'],
    watch: ['models', 'routes', 'server.js', 'gulpfile.js']
  })
  .on('start', function onStart() {
    // ensure start only got called once
    if (!called) { cb(); }
    called = true;
  })
  .on('restart', function onRestart() {
    // reload connected browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, 500);
  });
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('watch', function () {
  /* Watch scss, run the sass task on change. */
  gulp.watch(['scss/*.scss', 'scss/**/*.scss'], ['sass']);
  /* Watch app.js file, run the scripts task on change. */
  // gulp.watch(['js/**/*.js'], ['bs-reload']);
  /* Watch .html files, run the bs-reload task on change. */
  gulp.watch(['*.html', '*.js'], ['bs-reload']);
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['sass', 'browser-sync', 'watch'], function () {});

gulp.task('serve', ['sass', 'watch'], function () {});
