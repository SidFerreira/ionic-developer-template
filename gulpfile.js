if(require === null) { var require = function() {}; } //added
if(process === null) { var process = function() {}; } //added


var appModule = 'starter',
    templateModule = appModule,
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
    ngHtml2Js = require('gulp-ng-html2js'),
    rename = require('gulp-rename'),
    addsrc = require('gulp-add-src'),
    ngAnnotate = require('gulp-ng-annotate'),
    jshint = require('gulp-jshint'),
    sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss'],
  html: ['./www-dev/templates/*.html'], //Add Jade!
  css:  ['./www-dev/css/*.scss'],
  img:  ['./www-dev/img/**/*'],
  js:   ['./www-dev/js/**/*']
};

gulp.task('default', ['sass', 'css', 'img', 'minify']);

gulp.task('sass', function(done) {
	gulp.src('./scss/ionic.app.scss')
		.pipe(sass())
		.pipe(gulp.dest('./www-dev/css/'))
	
	gulp.src('./lib/ionic/release/fonts/**/*')
		.pipe(gulp.dest('./www/fonts/'))

	gulp.src('./lib/ionic/release/js/ionic.bundle.min.js')
		.pipe(rename('a.js'))
		.pipe(gulp.dest('./www/js/'))
	
    .on('end', done);
});

gulp.task('css', function(done) {
	gulp.src('./www-dev/css/*.css')
		.pipe(minifyCss({ keepSpecialComments: 0 }))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./www/css/'))
	    .on('end', done);
});

gulp.task('img', function(done) {
	gulp.src('./www-dev/img/**')
		.pipe(gulp.dest('./www/img/'))
	    .on('end', done);
});

gulp.task('lint', function () {
    return gulp.src('./www-dev/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('minify', function(done) {
    gulp.src('./www-dev/templates/*.html')
        .pipe(minifyHTML({empty: true, spare: true, quotes: true}))
        .pipe(ngHtml2Js({moduleName: templateModule, prefix: "templates/"}))
        .pipe(addsrc.prepend(['./www-dev/js/**/*.js']))
        .pipe(concat('b.js'))
		.pipe(ngAnnotate())
//        .pipe(uglify())
        .pipe(gulp.dest('./www/js/'));

	gulp.src('./www/js/b.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
		.on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.css,  ['css']);
  gulp.watch(paths.img,  ['img']);
  gulp.watch(paths.js,   ['minify']);
  gulp.watch(paths.html, ['minify']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
