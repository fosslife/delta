'use strict';

const gulp = require('gulp');
const postcss = require('gulp-postcss');

const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./public/index.html'],

    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

gulp.task('cssprod', () => {
    return gulp
        .src('public/style.css')
        .pipe(
            postcss([require('tailwindcss'), require('autoprefixer'), purgecss])
        )
        .pipe(gulp.dest('public/css'));
});

gulp.task('cssdev', function() {
    return gulp
        .src('public/style.css')
        .pipe(postcss([require('tailwindcss'), require('autoprefixer')]))
        .pipe(gulp.dest('public/css'));
});

// Not keeping default task for now deliberatly.
