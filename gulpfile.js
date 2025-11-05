const concat = require('gulp-concat');
const compass = require('gulp-compass');
const { dest, src } = require('gulp');
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const source = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const { constants } = require('buffer');

const VARS = {
    scss: {
        path: './resources/scss/',
        glob_path: './resources/scss/*.scss',
        config_rb: 'config.rb',
        dropin_search: './cms/app/Controller/AdminDropins/',
        out: './cms/app/webroot/css'
    },
    js: {
        include: './resources/js/includes.dev.js',
        path: './resources/js',
        out: './cms/app/webroot/js/'
    }
};

function getIncludes() {
    let includes = require(VARS.js.include).includes;
    Object.keys(includes).forEach(function(groupName) {
        for (let i = 0, length = includes[groupName].length; i < length; ++i) {
            includes[groupName][i] = `${VARS.js.path}/${includes[groupName][i]}`;
        }
    });
    return includes;
}

function promisifyStreams(streams) {
    return Promise.all(
        streams.map(stream => new Promise((resolve) => stream.on('end', () => resolve()))));
}

exports.compile_css = (done) => {
    if (process.platform === 'win32') {
        execSync('compileCss.bat');
    } else {
        try {
            execSync('/bin/bash -l -c ./compileCss');
        } catch (error) {
            console.error(`exec error: ${error}`);
        }
    }
    done();
};

exports.compile_js = () => {
    let includes = getIncludes();
    let streams = [];

    Object.keys(includes).forEach(function(groupName) {
        let group = includes[groupName];
        streams.push(src(group)
            .pipe(concat(groupName + '.js'))
            //.pipe(source.write(DESTINATION_FOLDER))
            .pipe(dest(VARS.js.out)));
    });

    return promisifyStreams(streams);
};

exports.compile_js_qa_prod = () => {
    let includes = getIncludes();
    let streams = [];

    Object.keys(includes).forEach(function(groupName) {
        let group = includes[groupName];
        streams.push(src(group)
            .pipe(concat(groupName + '.js'))
            //.pipe(stripComments())
            .pipe(terser())
            .pipe(source.write(VARS.js.out))
            .pipe(dest(VARS.js.out)));
    });

    return promisifyStreams(streams);
};

exports.compile_js_prod = () => {
    let includes = getIncludes();
    let streams = [];

    Object.keys(includes).forEach(function(groupName) {
        let group = includes[groupName];
        streams.push(src(group)
            .pipe(concat(groupName + '.js'))
            //.pipe(stripComments())
            .pipe(terser())
            .pipe(dest(VARS.js.out)));
    });

    return promisifyStreams(streams);
};












































/*

exports.compileCss = () => {
    let streams = [];

    streams.push(src(VARS.scss.glob_path)
        .pipe(compass({
            config_file: VARS.scss.config_rb,
            css: VARS.scss.out,
            sass: VARS.scss.path
        }))
        .pipe(dest(VARS.scss.out)));
        console.log("Normal Compass Done");

    let dropins = fs.readdirSync(VARS.scss.dropin_search);

    for (let dropin in dropins) {
        if (dropin < 1) {
            continue;
        }

        fs.access(dropins[dropin] + '/config.rb', constants.F_OK, () => {
            console.log(dropins[dropin]);
            streams.push(src(dropins[dropin] + '/*.rb' )
                .pipe(compass({
                    config_file: dropins[dropin].config_rb,
                    css: '/',
                    sass: '/'
                }))
                .pipe(dest(dropins[dropin] + '/')));

        });
    }

    return promisifyStreams(streams);
};
*/
