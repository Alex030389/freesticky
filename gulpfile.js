var syntax        = 'scss'; // Syntax: sass or scss;

var gulp          = require('gulp'),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		del           = require('del'),
		sourcemaps    = require('gulp-sourcemaps'),
		// rsync         = require('gulp-rsync'),
    // babel         = require("gulp-babel");
    svgSprite     = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false,
    // open: false,
    // online: false, // Work Offline Without Internet Connection
    // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
  })
});

gulp.task('clean', function () {
  return del(['app/assets/template/css', 'app/assets/template/js']);
});

gulp.task('html', function() {
  return gulp.src('app/*.html')
  .pipe(browserSync.stream())
});

gulp.task('styles', function() {
  return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
  // .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
  .pipe(rename({ suffix: '.min', prefix : '' }))
  .pipe(autoprefixer(['last 15 versions']))
  .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
  // .pipe(sourcemaps.write())
	.pipe(gulp.dest('app/assets/template/css'))
	.pipe(gulp.dest('./'))
  .pipe(browserSync.stream())
});

gulp.task('scripts', function() {
  return gulp.src([
    'app/libs/jquery/jquery.min.js',
    'app/libs/svg4everybody/svg4everybody.min.js',
    'app/libs/selectric/jquery.selectric.min.js',
    'app/libs/flipclock/flipclock.js',
    'app/_js/common.js'
    ])
  // .pipe(sourcemaps.init())
  .pipe(concat('scripts.min.js'))
  // .pipe(babel({
  //   presets: ['@babel/env']
  // }))
  .pipe(uglify()) // Mifify js (opt.)
  // .pipe(sourcemaps.write())
  .pipe(gulp.dest('app/assets/template/js'))
  .pipe(gulp.dest('./'))
  .pipe(browserSync.reload({ stream: true }))
});

// gulp.task('img', function() {
//   return gulp.src('app/img/**/*')
//   .pipe(gulp.dest('app/img'))
//   .pipe(browserSync.stream())
// });


gulp.task('watch', function() {
  gulp.watch('app/*.html', gulp.parallel('html'));
  gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
  gulp.watch('app/_js/**/*', gulp.parallel('scripts'));
  // gulp.watch(['libs/**/*.js', 'app/js/**/*'], gulp.parallel('scripts'));
  // gulp.watch('app/img/**/*', gulp.parallel('img'));
});

gulp.task('default', gulp.parallel(
  'clean',
  'styles',
  'scripts',
  // 'img',
  'browser-sync',
  // 'deploy',
  'watch'
));



// gulp.task('rsync', function() {
// 	return gulp.src('app/_js/common.js')
// 	.pipe(rsync({
// 		root: 'app/_js/',
// 		hostname: 'user@sait.com',
// 		destination: 'user/public_html/',
// 		// include: ['*.htaccess'], // Includes files to deploy
// 		//exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
// 		recursive: true,
// 		archive: true,
// 		silent: false,
// 		compress: true
// 	}))
// });

gulp.task('svg', function () {
	return gulp.src('app/_img/icons/svg/*.svg')
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "sprite.svg",
				}
			}
		}))
		.pipe(gulp.dest('app/assets/template/img/icons/svg/'));
});

// for color icon
gulp.task('svg-color', function () {
	return gulp.src('app/_img/icons/svg/color/*.svg')
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				// $('[fill]').removeAttr('fill');
				// $('[stroke]').removeAttr('stroke');
				// $('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "sprite-c.svg",
				}
			}
		}))
		.pipe(gulp.dest('app/assets/template/img/icons/svg/color/'));
});