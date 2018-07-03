var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    path = require('path'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    browserSync = require('browser-sync').create();

//sass
gulp.task('sass:style', function(){
     return gulp.src('./source/css/*.scss')
 		.pipe(sass({
 			outputStyle: 'expanded',
 			precision: 3
 		}))
    .pipe(autoprefixer({
    	browsers: ['last 2 versions', 'ie >= 10'],
    	cascade: false
    }))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream());
})
//css
gulp.task('css:vendor', function() {
     return gulp.src('./source/css/css/vendors/*.css')
    .pipe(concat('vendors.css'))
    .pipe(gulp.dest('./public/css'));
});
//js
gulp.task('js:components', function() {
    return gulp.src('./source/js/components/*.js')
        .pipe(uglify({
            preserveComments: 'license',
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true
            }
        }))
        .pipe(concat('components.min.js'))
        .pipe(gulp.dest('./public/js'));
});
gulp.task('js:vendor', function() {
    return gulp.src([
        './source/js/vendor/*.js'
    ])
        .pipe(uglify({
            mangle: true,
            preserveComments: 'license',
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true
            }
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        //.pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('./public/js'));
});
// html
gulp.task('html', function() {
  return gulp.src('./source/*.html')
    .pipe(gulp.dest('./public'));
});
//images
gulp.task('cp:img', function () {
  return gulp.src(
    ['**/*.gif', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
    {cwd: path.resolve('./source/images')})
    .pipe(gulp.dest(path.resolve('./public/images')));
});
//subtitles
gulp.task('cp:subtitles', function () {
  return gulp.src('./source/subtitles/*.*')
    .pipe(gulp.dest('./public/subtitles'));
});
//github files
gulp.task('cp:github', function () {
  return gulp.src('./github/**')
    .pipe(gulp.dest('./public'));
});


gulp.task('assets', ['sass:style', 'css:vendor', 'js:vendor', 'js:components', 'html', 'cp:img', 'cp:subtitles', 'cp:github']);

gulp.task('serve', ['assets'], function (){
  browserSync.init({
    server: {
      baseDir: path.resolve('./public/')
/*  "paths" : {
    "source" : {
      "root": "./source/",
      "patterns" : "./source/_patterns/",
      "data" : "./source/_data/",
      "styleguide" : "./core/styleguide/",
      "patternlabFiles" : "./core/",
      "js" : "./source/js",
      "images" : "./source/images",
      "fonts" : "./source/fonts",
      "css" : "./source/css/"
    },
    "public" : {
      "root" : "./public/",
      "patterns" : "./public/patterns/",
      "data" : "./public/data/",
      "styleguide" : "./public/styleguide/",
      "js" : "./public/js",
      "images" : "./public/images",
      "fonts" : "./public/fonts",
      "css" : "./public/css"
    }
*/
    },
  });

  gulp.watch('./source/css/**/*.scss', ['sass:style']);
  gulp.watch('./source/css/**/*.css', ['css:vendor']);
  gulp.watch('./source/js/components/**/*.js', ['js:components']);
  gulp.watch('./source/js/vendor/**/*.js', ['js:vendor']);
  gulp.watch('./source/*.html', ['html']);

});
