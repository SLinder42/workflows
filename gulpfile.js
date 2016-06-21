var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
}
else {
    outputDir = 'builds/production/'
    sassStyle = 'compressed'
}

coffeeSources = ['builds/components/coffee/tagline.coffee'];
jsSources = [
  'builds/components/scripts/rclick.js',
  'builds/components/scripts/pixgrid.js',
  'builds/components/scripts/tagline.js',
  'builds/components/scripts/template.js'
];
sassSources = ['builds/components/sass/style.scss'];
htmlSources = [outputDir+'*.html'];
jsonSources = [outputDir+'js/*.json'];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('builds/components/scripts'))
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest(outputDir+'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'builds/components/sass',
      image: outputDir+'images',
      style: sassStyle
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(outputDir+'css'))
});

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('builds/components/sass/*.scss', ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});

gulp.task('connect',function() {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(connect.reload())
});

gulp.task('json', function() {
    gulp.src(jsonSources)
        .pipe(connect.reload())
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);