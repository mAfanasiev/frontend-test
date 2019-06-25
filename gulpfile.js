const gulp   		= require('gulp');
const browserSync   = require('browser-sync');
const sass   		= require('gulp-sass');
const concat 		= require('gulp-concat');
const autoprefixer  = require('gulp-autoprefixer');
const sourcemaps    = require('gulp-sourcemaps');
const csso   		= require('gulp-csso');
const include     	= require('gulp-include');
const del     		= require('del');
const wait 			= require('gulp-wait');
const svgmin 		= require('gulp-svgmin');
const pug = require('gulp-pug');
const notify = require('gulp-notify');

let path = {
	src: {
		html: 'app/*.pug',
		style: 'app/style/main.scss',
		scripts: 'app/js/**/*.js',
		img: 'app/img/*.+(jpg|jpeg|png|svg|ico|gif)',
		svg: 'app/img/**/*.svg'
	},
	build: {
		html: 'build',
		style: 'build/css',
		scripts: 'build/js',
		img: 'build/img'
	},
	watch: {
		htmlApp: 'app/*.pug',
		html: 'app/components/**/*.pug',
		style: 'app/**/*.+(sass|scss)',
		scripts: 'app/**/*.js',
		img: 'app/img/*.+(jpg|jpeg|png|svg|ico|gif)',
		svg: 'app/img/**/*.svg'
	}
};

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false,
		tunnel: false,
		port: 8000,
  		host: "localhost"
	});
});

gulp.task('html', function() {
	return gulp.src(path.src.html)
		.pipe(include())
		.pipe(pug().on('error', notify.onError( (error) => { return `pug went wrong, ${error}`; } )) )
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('style', function(done){
	gulp.src(path.src.style)
		.pipe(sourcemaps.init())
  		.pipe(wait(100))
    	.pipe(sass().on('error', function(error) {
        	done(error);
      	}))
    	.pipe(concat('main.css'))
    	.pipe(autoprefixer({
    	  browsers: ['last 2 versions'],
    	  cascade: false 
    	}))
    	.pipe(csso({}))
    	.pipe(sourcemaps.write())
    	.pipe(gulp.dest(path.build.style))
    	.on('end', function() {
        	done();
      	})
    	.pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
	return gulp.src(path.src.scripts)
		.pipe(sourcemaps.init())
		.pipe(include())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.scripts))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
	return gulp.src(path.src.img)
	  	.pipe(gulp.dest(path.build.img))
	  	.pipe(browserSync.reload({stream: true}));
});

gulp.task('svg', function() {
	return gulp.src(path.src.svg)
		.pipe(svgmin({
            plugins: [{
                removeViewBox: false
            }]
        }))
	  	.pipe(gulp.dest(path.build.img))
	  	.pipe(browserSync.reload({stream: true}));
});


gulp.task('deploy:style', function(){
	return gulp.src(path.src.style)
		.pipe(sass())
		.pipe(concat('main.css'))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false 
		}))
		.pipe(csso({}))
		.pipe(gulp.dest(path.build.style))
});

gulp.task('deploy:scripts', function() {
	return gulp.src(path.src.scripts)
		.pipe(include())
		.pipe(gulp.dest(path.build.scripts))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('clean', function() {
	return del.sync('build/*')
});

gulp.task('watch', ['clean','browser-sync', 'html', 'style', 'scripts', 'img'], function() {
	gulp.watch([path.watch.htmlApp, path.watch.html], ['html']);
	gulp.watch([path.watch.style], ['style']);
	gulp.watch([path.watch.img], ['img']);
	gulp.watch([path.watch.scripts], ['scripts']);
});

gulp.task('deploy', ['clean', 'html', 'deploy:style', 'deploy:scripts', 'img']);

gulp.task('default', ['watch']);
