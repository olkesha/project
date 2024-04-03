const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();

// сервер - изменения папки dist/ в реальном времени в браузере
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}


// сборка html-файлов
function html() {
  return gulp.src('src/**/*.html')
        .pipe(plumber())
                .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true})); // перезагрузка страницы
}

// бандл css-файлов
function css() {
  return gulp.src('src/blocks/**/*.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
                .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true})); // перезагрузка страницы
}

// сборка фотографий
function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({stream: true})); // перезагрузка страницы
}

// функция для очистки dist/ - удалить все файлы из папки и загрузить туда новые результаты. Так внутри не останется ничего лишнего.
function clean() {
  return del('dist');
}

exports.html = html; // строчка, которая позволит вызвать задачу из терминала
exports.css = css;
exports.images = images;
exports.clean = clean;



// сборка одной командой
// series() — выполняет задачи по очереди
// parallel() — выполняет задачи параллельно
const build = gulp.series(clean, gulp.parallel(html, css, images));
exports.build = build;


// отслеживание изменений в файлах
// следит за файлами в src/ и делает пересборку после каждого изменения этих файлов
function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
}
const watchapp = gulp.parallel(build, watchFiles, serve);
exports.watchapp = watchapp;