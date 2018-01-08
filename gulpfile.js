var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');
var autoPrefixer = require('gulp-autoprefixer');


gulp.task('sass', function(){
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/**/*.+(scss|sass)'])
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('src/css'))
    .pipe(autoPrefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass'],  function() {
  gulp.watch('src/scss/**/*.+(sass|scss)', ['sass']);
  // Add more files to watch
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'src'
    }
  })
});

gulp.task('useref', function() {
  return gulp.src('src/*.html')
    .pipe(useref())
    // Minifies only if it's a JS file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});


gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function(){
  return del.sync('dist');
});

gulp.task('build', function(callback){
  runSequence('clean:dist',
    ['sass', 'useref', 'fonts'],
    callback
  )
});

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  )
});
