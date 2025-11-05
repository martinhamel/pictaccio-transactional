import { platform } from 'node:os';
import closureCompiler from 'google-closure-compiler';
import gulp from 'gulp';
import gulpConcat from 'gulp-concat';
import gulpClean from 'gulp-clean';
import gulpSassConstructor from 'gulp-sass';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpStripComments from 'gulp-strip-comments';
import gulpTypescript from 'gulp-typescript';
import { spawn } from 'node:child_process';
import { basename, join, relative, resolve } from 'path';
import { symlink } from "fs/promises";
import sass from 'sass';
import { SourceMapConsumer, SourceMapGenerator } from 'source-map';
import { Transform } from 'stream';
import { minify } from 'uglify-js';

const gulpSass = gulpSassConstructor(sass);
const gulpClosureCompiler = closureCompiler.gulp();
const dirs = {
    in: {
        dist: ['./dist/*'],
        distWithoutPublic: ['./dist/**/*.js', '!./dist/public/'],
        docPages: './src/http/views/doc_pages/**/*.md',
        frontendScripts: './src_public/scripts/**/*.ts',
        frontendScriptDir: './src_public/scripts/',
        locales: './src/locales/**/*.yaml',
        publicScript: './dist/public/js/app.js',
        scss: './src_public/scss/**/*.scss',
        templates: './src/http/views/templates/**/*',
        temporary: ['./build/bundle.min.js'],
        nodeModules: './node_modules',
        nodeModulesGulp: './node_modules/**/*'
    },
    out: {
        dist: '../../cms/companion/',
        distModules: '../../cms/companion/node_modules/',
        docPages: './dist/http/views/doc_pages/',
        css: '../../cms/companion/public/css/',
        locales: '../../cms/companion/locales/',
        publicScript: '../../cms/companion/public/js/',
        templates: '../../cms/companion/http/views/templates/'
    }
}

/* COMMON FUNCTIONS */
function clean() {
    return gulp.src(dirs.in.dist)
        .pipe(gulpClean());
}

function getCurrentTag() {
    return new Promise((resolve, reject) => {
        const git = spawn('git', ['describe', '--contains', '--tags'], {stdio: ['pipe', 'pipe', 'pipe']});
        let stdout = '';
        let stderr = '';

        if (git && git.stdout) {
            git.stderr.addListener('data', (chunk) => {
                stderr += chunk.toString();
            });
            git.stdout.addListener('data', (chunk) => {
                stdout += chunk.toString();
            });
            git.stdout.addListener('end', () => {
                if (stderr !== '') {
                    reject(new Error('Missing tag on current branch'));
                } else {
                    resolve(stdout);
                }
            });
        }
    });
}


/* PRE COMPILE FUNCTIONS */

/* COMPILE FUNCTIONS */

/* POST COMPILE FUNCTIONS */
function compileCss() {
    return gulp.src(dirs.in.scss)
        .pipe(gulpSass.sync().on('error', gulpSass.logError))
        .pipe(gulp.dest(dirs.out.css));
}

async function linkNodeModules() {
    try {
        if (platform() === 'win32') {
            gulp.src(dirs.in.nodeModulesGulp)
                .pipe(gulp.dest(dirs.out.distModules))
        } else {
            await symlink(resolve(dirs.in.nodeModules), dirs.out.distModules);
        }
    } catch (e) {
        console.log(e);
    }
}

async function copyNodeModules() {
    gulp.src(dirs.in.nodeModulesGulp)
        .pipe(gulp.dest(dirs.out.distModules))
}

function minifyBackend() {
    return gulp.src(dirs.in.distWithoutPublic)
        .pipe(new Transform({
            objectMode: true,
            transform(object, encoding, callback) {
                if (object.contents) {
                    object.contents =
                        Buffer.from(minify(
                            object.contents.toString()).code, {mangle: true});
                }
                callback(null, object);
            },
        }))
        .pipe(gulp.dest(dirs.out.dist));
}

function minifyFrontend() {
    return Promise.all([
        gulpClosureCompiler({
            js: dirs.in.publicScript,
            externs: [
                'node_modules/requirejs/require.js',
                'node_modules/tslib/tslib.js',
                'node_modules/typedi/bundles/typedi.umd.js'
            ],
            compilation_level: 'ADVANCED',
            warning_level: 'VERBOSE',
            hide_warnings_for: [
                'node_modules/requirejs/require.js',
                'node_modules/tslib/tslib.js',
                'node_modules/typedi/bundles/typedi.umd.js'
            ],
            jscomp_off: 'externsValidation',
            language_in: 'ECMASCRIPT6_STRICT',
            language_out: 'ECMASCRIPT5_STRICT',
            output_wrapper: '(function(){\n%output%\n}).call(this)',
            js_output_file: 'app.min.js'
        })
        .src() // needed to force the plugin to run without gulp.src
        .pipe(gulpStripComments())
        .pipe(gulp.dest(dirs.out.publicScript)),

        gulpClosureCompiler({
            js: [
                'node_modules/requirejs/require.js',
                'node_modules/tslib/tslib.js',
                'build/typedi.umd.js'
            ],
            compilation_level: 'WHITESPACE_ONLY',
            warning_level: 'QUIET',
            language_in: 'ECMASCRIPT6_STRICT',
            language_out: 'ECMASCRIPT5_STRICT',
            output_wrapper: '%output%',
            js_output_file: 'bundle.min.js'
        })
            .src()
            /*gulp.src([
                'node_modules/requirejs/require.js',
                'node_modules/tslib/tslib.js',
                'build/typedi.umd.js'
            ])*/
            .pipe(gulpStripComments())
            .pipe(gulpConcat('bundle.min.js'))
            .pipe(gulp.dest(dirs.out.publicScript))
    ]);
}


/* EXPORTS */
export const postCompileTasks = gulp.series(
    linkNodeModules
);

export const postCompileTasks_prod = gulp.series(
    minifyBackend,
    minifyFrontend,
    compileCss,
    copyNodeModules
);
