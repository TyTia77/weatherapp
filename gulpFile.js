const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');
const autoprefixer = require('gulp-autoprefixer');
const watch = require('gulp-watch');

gulp.task('buildjs', () => {
    return gulp
        // .src('[app/js/**/*.+(js|css)]')
        .src(['app/js/angular.js', 'app/js/directives/**/*.js', 'app/js/services/**/*.js',
        'app/js/factories/**/*.js', 'app/js/controllers/**/*.js'])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/dist/scripts'));
});

gulp.task('buildcss', () => {
    return gulp
        .src('app/style/style.+(js|css|scss)')
        .pipe(sass())
        .pipe(uglifycss({
            // "maxLineLen": 80,
            "uglyComments": false
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('app/dist/styles'));
});

gulp.task('watch', () => {
    gulp.watch(
        [
            './app/style/**/*.scss',
            './app/style/**/*.css'
        ],
        ['buildcss']
    );

    gulp.watch(
        [
            './app/js/**/*.js',
            './app/es6/*.js'
        ],
        ['buildjs']
    );
});

//default
gulp.task('default', ['watch']);
