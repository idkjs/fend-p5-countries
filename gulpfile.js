// Include gulp
var gulp = require('gulp'),
    webserver = require('gulp-webserver');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');

/* Defines the paths where gulp will find the files.
http://justinmccandless.com/post/a-tutorial-for-getting-started-with-gulp/
*/
var bases = {
 app: 'app/',
 dist: 'dist/',
};

var paths = {
 js: ['js/*.js'],
 libs: ['js/lib/*.js'],
 css: ['css/*.css'],
 sass: ['sass/*.scss'],
 html: ['index.html']
};

// Process scripts and concatenate them into one output file
gulp.task('js', function() {
 gulp.src(paths.js, {cwd: bases.app})
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(uglify())
 .pipe(concat('app.min.js'))
 .pipe(gulp.dest(bases.dist + 'js/'));
});

gulp.task('copy', function() {
 // Copy html
 gulp.src(paths.html, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));
 
  // Copy styles
 gulp.src(paths.css, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist + 'css'));

gulp.src(paths.libs, {cwd: 'app/**'})
.pipe(gulp.dest(bases.dist));

gulp.src(paths.js, {cwd: 'app/**'})
 .pipe(gulp.dest(bases.dist));

});

//CSS autoprefixer
gulp.task('default', function () {
	return gulp.src(paths.css, {cwd: bases.app})
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dist'));
});
// Lint Task
gulp.task('lint', function() {
    return gulp.src(paths.js, {cwd: bases.app})
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(paths.sass, {cwd: bases.app})
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('js', function() {
    return gulp.src(paths.js, {cwd: bases.app})
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('app/**/*', ['js', 'copy']);
});

/* rung webserver on dist folder */
gulp.task('webserver', function () {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});
 
gulp.task('default', function () {
	return gulp.src(paths.css, {cwd: bases.app})
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dist'));
});

// Default Task
gulp.task('default', ['lint', 'sass', 'js', 'copy', 'watch', 'webserver']);