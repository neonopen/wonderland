// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var gulp = require('gulp');
var sassLint = require('gulp-sass-lint');
var eslint = require('gulp-eslint');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');
var concatCss = require('gulp-concat-css');
var merge = require('merge-stream');
var autoprefixer = require('gulp-autoprefixer');
var jest = require('gulp-jest').default;
var envify = require('gulp-envify');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var historyApiFallback = require('connect-history-api-fallback');

var argv = require('yargs').argv;
var env = argv.env ? argv.env : 'dev';
var configSrc   = './env/config.json.' + env;
var timelineConfigSrc = './env/timeline/timeline.config.json.raw';

var redirects_src;
if (env == 'prod') {
    redirects_src = './env/prod/_redirects';
} else if (env == 'stage') {
    redirects_src = './env/stage/_redirects';
} else if (env == 'test') { // testymctestface
    redirects_src = './env/test/_redirects';
} else {
    redirects_src = './env/dev/_redirects';
}

var staticsSrc = ['./src/**/*.html', './src/robots.txt', './src/*.ico'];
var dataSrc = ['./data/**'];

var testOutputDir = 'test_output';
var testOutputFile = 'test_results.xml';

var sassFileSource = './src/css/**/*.scss'
var jsFileSources = ['src/js/**/*.js', '__tests__/**/*.js'];

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
        }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function buildStyle(isUglified) {
    gutil.log('buildStyle');
    var fontAwesomeStream = gulp.src('./node_modules/font-awesome/css/font-awesome.min.css');
    var hintCssStream = gulp.src('./node_modules/hint.css/hint.min.css');
    var sassStream = gulp.src('./src/css/neon/**/*')
        .pipe(sass()) // Using gulp-sass
    ;
    var xxStream = gulp.src('./src/css/xx/**/*')
        .pipe(sass())
    ;
    var mergedStream = merge(fontAwesomeStream,/* sassStream, hintCssStream,*/ xxStream)
    // var mergedStream = merge(fontAwesomeStream, sassStream, hintCssStream, xxStream)
        .pipe(concatCss('wonderland.css', {
            rebaseUrls: false
        }))
        .pipe(gulpif(isUglified, uglifycss({
            uglyComments: true
        })))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 1% in US']
        }))
        .pipe(gulp.dest('./build/css/'))
        .pipe(reload({
            stream: true
        }))
    ;
    return mergedStream;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('stylesDebug', function() {
    buildStyle(false);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('stylesLive', function() {
    buildStyle(true);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('statics', function() {
    return gulp.src(staticsSrc)
        .pipe(gulp.dest('./build/'))
        .pipe(reload({
            stream: true
        }));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
gulp.task('data', function() {
    return gulp.src(dataSrc)
        .pipe(gulp.dest('./build//data/'))
        .pipe(reload({
            stream: true
        }));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('clipboardJs', function() {
    return gulp.src('./node_modules/clipboard/dist/clipboard.min.js')
        .pipe(gulp.dest('./build/js/'))
        .pipe(reload({
            stream: true
        }));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('objectFitPoly', function() {
    return gulp.src('./node_modules/object-fit-videos/dist/object-fit-videos.min.js')
        .pipe(gulp.dest('./build/js/'))
        .pipe(reload({
            stream: true
        }));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('timelineConfig', ['clean:timelineConfig'], function() {
    return gulp.src(timelineConfigSrc)
        .pipe(envify())
        .pipe(rename('timeline.config.json'))
        .pipe(gulp.dest('./env'))
        .pipe(reload({
            stream: true
        }))
    ;
});

gulp.task('clean:timelineConfig', function() {
      return gulp.src('./env/timeline.config.json', {read: false})
        .pipe(clean());
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('config', ['clean:config'] ,function() {
    return gulp.src(configSrc)
        .pipe(rename('config.json'))
        .pipe(gulp.dest('./env'))
        .pipe(reload({
            stream: true
        }))
    ;
});

gulp.task('clean:config', function() {
      return gulp.src('./env/config.json', {read: false})
        .pipe(clean());
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('redirects', function() {
    return gulp.src(redirects_src)
        .pipe(gulp.dest('./build/'));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('fonts', function() {
    var fontAwesome = gulp.src('node_modules/font-awesome/fonts/*');

    var fonts = gulp.src('./src/fonts/*');

    return merge(fontAwesome, fonts)
        .pipe(gulp.dest('./build/fonts/'));
})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('images', function() {
    gulp.src('./src/img/**')
        .pipe(gulp.dest('./build/img/'))
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        },
        middleware: [historyApiFallback({
            // https://github.com/bripkens/connect-history-api-fallback#rewrites
            rewrites: [
                {
                    from: /\/video\/.*/,
                    to: '/index.html'
                },
                {
                    from: /\/account\/confirm\/.*/,
                    to: '/index.html'
                },
                {
                    from: /\/user\/reset\/token\/.*/,
                    to: '/index.html'
                },
                {
                    from: /\/share\/.*/,
                    to: '/index.html'
                }
            ]
        })],
        ghostMode: false
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function buildScript(file, watch) {

    var props = {
        entries: ['./src/js/' + file],
        debug : true,
        cache: {},
        packageCache: {},
        transform: [
            babelify.configure({
                compact: true,
                presets : ['es2015', 'react', 'stage-0']
            })
        ]
    };

    // watchify() if watch requested, otherwise run browserify() once
    var bundler = watch ? watchify(browserify(props)) : browserify(props);

    function rebundle() {
        var stream = bundler.bundle();
        return stream
            .on('error', handleErrors)
            .pipe(source(file))
            .pipe(buffer())
            .pipe(gulpif(!watch, uglify()))
            .pipe(gulp.dest('./build/js/'))
            .pipe(reload({ stream: true }))
    }

    // listen for an update and run rebundle
    bundler.on('update', function() {
        rebundle();
        gutil.log('Rebundle...');
    });

    // run it once the first time buildScript is called
    return rebundle();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('default', null, function() {
    gutil.log('Gulp is running - default');
    gutil.log('Please use debug OR live.');
});

gulp.task('sass-lint', function () {
  return gulp.src(sassFileSource)
    .pipe(sassLint({
        options: {
            'config-file': '.sass-lint.yml'
        }
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

// Like sass-lint task but output in checksyle xml for CI.
gulp.task('sass-lint-checkstyle', function () {
  return gulp.src(sassFileSource)
    .pipe(sassLint({options: {
        configFile: '.sass-lint.yml',
        formatter: 'checkstyle',
    }}))
    .pipe(sassLint.format())
});

gulp.task('eslint', function() {
    return gulp.src(jsFileSources)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('eslint-checkstyle', function() {
    return gulp.src(jsFileSources)
        .pipe(eslint())
        .pipe(eslint.format('checkstyle', process.stdout));
});

gulp.task('debug', ['images', 'stylesDebug', 'clipboardJs', 'objectFitPoly', 'fonts', 'statics', 'data', 'config', 'timelineConfig', 'browser-sync'], function() {
    gutil.log('Gulp is running - debug');
    gutil.log('ENVIRONMENT: ' + env);
    gulp.watch('./src/img/**/*', ['images']);
    gulp.watch('./src/css/**/*', ['stylesDebug']);
    gulp.watch(staticsSrc, ['statics']);
    gulp.watch(configSrc, ['config']);
    gulp.watch(timelineConfigSrc, ['timelineConfig']);
    return buildScript('wonderland.js', true);
});

gulp.task('live', ['images', 'stylesLive', 'clipboardJs', 'objectFitPoly', 'fonts', 'statics', 'data', 'config', 'timelineConfig', 'redirects'], function() {
    gutil.log('Gulp is running - live');
    gutil.log('ENVIRONMENT: ' + env);
    return buildScript('wonderland.js', false);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task('run-tests', function() {
    return gulp.src('__tests__').pipe(jest({
        config: {
            rootDir: ".",
            setupTestFrameworkScriptFile: "<rootDir>/setup-jasmine-env.js",
            setupFiles: [
                "<rootDir>/__tests__/before.js",
            ],
            testPathIgnorePatterns: [
                "<rootDir>/__tests__/before.js",
            ],
            moduleFileExtensions: [
                "js",
                "json",
                "react",
            ],
        }
    }));
});

gulp.task('test', ['run-tests'], function() {
    var fs = require('fs');
    var path = require('path');
    var async = require('async');
    var reportMerger = require('junit-report-merger');
    var results = fs.readdirSync(testOutputDir);
    var files = results.map(x => path.join(testOutputDir, x));
    reportMerger.mergeFiles(testOutputFile, files, {}, function() {
        async.each(files, fs.unlink);
    });
});
