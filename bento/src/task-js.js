'use strict';

let gutil = require('gulp-util');
let sourcemaps = require('gulp-sourcemaps');
let duration = require('./gulp-duration');

let sizing = require('./sizing');
let miniprod = require('./miniprod');
let errortrap = require('./errortrap');

let browserify = require('browserify');
let tsify = require('tsify');
let watchify = require('watchify');
let stringify = require('./stringify');

let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');

module.exports = function (gulp, projectJsEntry, outputJsFolder, isProduction, watch) {
    let bundler = browserify({
        debug: true,
        noParse: ['angular', 'jquery'],
        cache: {},
        packageCache: {}
    }).transform(stringify, {
        minify: true
    }).add(projectJsEntry).plugin(tsify);

    bundler.compile = function () {
        gutil.log('Compiling JS', gutil.colors.cyan(projectJsEntry));

        return bundler.bundle()
            .on('error', gutil.log)
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(errortrap())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(miniprod(isProduction))
            .pipe(sourcemaps.write('./'))
            .pipe(sizing())
            .pipe(duration('Finished JS compilation after'))
            .pipe(gulp.dest(outputJsFolder));
    };

    if (watch) {
        bundler.plugin(watchify);
        bundler.on('update', bundler.compile);
    }

    gulp.task('js', bundler.compile);
};
