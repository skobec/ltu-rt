var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var ejs = require('gulp-ejs');
// var babel = require('gulp-babel');
var fs = require('fs');

gulp.task('grid', function () {
    return gulp.src('src/style/**/grid-system.scss')
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/style/'));
});

gulp.task('sass', function () {
    return gulp.src('src/style/**/index.scss')
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/style/'));
});

gulp.task('scripts', function () {
    return gulp.src('src/js/**/*.js')
        // .pipe(babel({
        //     presets: ['es2015']
        // }))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('sections', ['sass'], function () {
    var criticalStyle = fs.readFileSync('./dist/style/index.css', 'utf8');
    var version = '4';
    return gulp.src('./src/*.ejs')
        .pipe(ejs({criticalStyle: criticalStyle, version: version}, {}, {ext: '.html'}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'))
});

gulp.task('assets', function () {
    gulp.src(['./src/images/**/*'])
        .pipe(gulp.dest('./dist/images'))
});

gulp.task('fonts', function () {
    gulp.src(['./src/fonts/**/*'])
        .pipe(gulp.dest('./dist/fonts'))
});

gulp.task('css', function () {
    return gulp.src('./src/css/**/*')
        .pipe(gulp.dest('./dist/style'))

});

gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/**/*.ejs', ['sections']);
    gulp.watch('src/style/**/*.scss', ['sass', 'sections']);
    gulp.watch('src/images/**/*', ['assets']);
});


gulp.task('default', ['sass', 'assets', 'scripts', 'sections', 'fonts', 'grid', 'css', 'js']);