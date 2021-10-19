const gulp = require('gulp');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const typescript = require('gulp-typescript');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sass = require('gulp-sass')(require('sass'));
sass.compiler = require('sass');

const src = './src';
const buildDir = './build';
const ts = false;

const reload = (done) => {
    browserSync.reload();
    done();
};

const serve = (done) => {
    browserSync.init({
        server: {
            baseDir: `${buildDir}`
        }
    });
    done();
};

const css = () => {
    return gulp.src(`${src}/{sass,scss}/**/*.{sass,scss}`)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest(`${buildDir}/css`));
};

const script = () => {
    if (ts) {
        return gulp.src(`${src}/ts/**/*.ts`)
            .pipe(typescript())
            .pipe(gulp.dest(`${buildDir}/js`));
    }
    return gulp.src(`${src}/js/**/*.js`)
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(`${buildDir}/js`));
}

const html = () => {
    return gulp.src(`${src}/*.html`)
        // .pipe(htmlmin({
        //     collapseWhitespace: true,
        //     removeComments: true,
        //     html5: true,
        //     sortAttributes: true,
        //     sortClassName: true
        // }))
        .pipe(gulp.dest(`${buildDir}`));
};

const assets = () => {
    return gulp.src(`${src}/assets/**/*`)
        .pipe(gulp.dest(`${buildDir}/assets`));
};

const watch = () => {
    gulp.watch(
        [
            `${src}/*.html`,
            `${src}/script/**/*.(js|ts)`,
            `${src}/sass/**/*.{sass,scss}`,
            `${src}/assets/**/*.*`
        ],
        gulp.series(
            assets,
            css,
            script,
            html,
            reload
        ))
};

const dev = gulp.task(
    'dev',
    gulp.series(
        gulp.parallel(
            assets, css, script, html
        ), serve, watch
    ));

const build = gulp.task(
    'build',
    gulp.parallel(
        assets, css, script, html
    ));

exports.dev = dev;
exports.build = build;