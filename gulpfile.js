const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');

// Paths
const paths = {
  styles: {
    src: 'styles/**/*.scss',
    dest: 'public/css'
  }
};

// Compile SASS
function compileStyles() {
  return gulp.src(paths.styles.src)
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dest));
}

// Watch files
function watchFiles() {
  gulp.watch(paths.styles.src, compileStyles);
}

// Default task
exports.default = compileStyles;
exports.watch = gulp.series(compileStyles, watchFiles);
exports.build = compileStyles;
exports.styles = compileStyles;

