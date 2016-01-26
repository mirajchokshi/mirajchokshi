// Include gulp
var gulp = require('gulp');

// Include gulp plugins
var uncss = require('gulp-uncss');
var concatCss = require('gulp-concat-css');
var resolveDependencies = require('gulp-resolve-dependencies');
var concatJs = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var htmlreplace = require('gulp-html-replace');


// Update html files
gulp.task('uphtml', function() {
  gulp.src('*.html')
    .pipe(htmlreplace({
        'css': 'css/bundled.min.css',
        'js': 'js/bundled.min.js'
    }))
    .pipe(gulp.dest('gh-pages/'));
});

// Concat + reduce + minify CSS
gulp.task('conredmincss', function () {
  gulp.src('css/*.css')
    .pipe(concatCss("bundled.css"))
    .pipe(uncss({
            html: ['gh-pages/index.html'],
            ignore: ['.navbar-toggle.active .icon-bar:nth-of-type(1)', '.navbar-toggle.active .icon-bar:nth-of-type(2)','.navbar-toggle.active .icon-bar:nth-of-type(3)', '.collapsing'],
        }))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(rename("bundled.min.css"))
    .pipe(gulp.dest('gh-pages/css'));
});

// Concat + minify JS 
gulp.task('conminjs', function(){
  gulp.src(['js/*.js'])
    .pipe(resolveDependencies({
      pattern: /\* @requires [\s-]*(.*\.js)/g
    }))
        .on('error', function(err) {
            console.log(err.message);
        })
    .pipe(concatJs("bundled.js"))
    .pipe(uglify())
    .pipe(rename("bundled.min.js"))
    .pipe(gulp.dest('gh-pages/js/'));
});

// Optimize images
gulp.task('optimg', function () {
    return gulp.src('images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('gh-pages/images'));
});
 

// Default task
gulp.task('default', ['uphtml', 'conredmincss', 'conminjs']);
