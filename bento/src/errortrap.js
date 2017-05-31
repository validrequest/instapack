'use strict';

let plumber = require('gulp-plumber');  // Prevents gulp-watch from stopping on compilation error!
let gutil = require('gulp-util');

let plumberSettings = {
    errorHandler: function (error) {
        gutil.log(error);
        this.emit('end');
    }
};

module.exports = function () {
    return plumber(plumberSettings);
};
