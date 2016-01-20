/*!
 * npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    bower = require('gulp-bower'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    webserver = require('gulp-webserver'),
    del = require('del');

var config = {
    sassPath: './app/styles/sass',
    bowerDir: './bower_components',
    publicPath: './dist',
    scriptSrcPath: './app/scripts'
}

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest(config.publicPath + '/fonts'));
});

gulp.task('css', function () {
    return sass(config.sassPath + '/style.scss', {
        precision: 6,
        stopOnError: true,
        cacheLocation: './cache',
        loadPath: [
            config.sassPath,
            config.bowerDir + '/bootstrap-sass/assets/stylesheets',
            config.bowerDir + '/font-awesome/scss',
            config.bowerDir + '/font-awesome/scss'
        ]
    })
        .on("error", notify.onError(function (error) {
            return "Error: " + error.message;
        }))
        .pipe(gulp.dest(config.publicPath+'/css'))
        .pipe(notify({ message: 'CSS task complete' }));
});

gulp.task('scripts', function() {
    return gulp.src(config.scriptSrcPath + '/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(config.publicPath + '/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(config.publicPath + '/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
    gulp.watch(config.scriptSrcPath + '/**/*.js', ['scripts']);
});

gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            fallback:'index.html'
        }));


});

gulp.task('default', ['bower', 'icons', 'css','scripts']);
