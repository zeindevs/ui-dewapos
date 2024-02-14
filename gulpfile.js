const { series, watch, src, dest } = require("gulp");
const rollup = require("gulp-rollup");
const sass = require("gulp-sass")(require("sass"));
const rimraf = require("gulp-rimraf");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

const javascript = async () => {
  return (
    src("src/**/*.js")
      .pipe(
        rollup({
          input: "src/js/main.js",
          output: {
            format: "iife",
          },
        }),
      )
      .pipe(dest("dist"))
  );
};

const css = () => {
  return src("src/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("dist/css"));
};

const html = () => {
  return src("src/**/*.ejs")
    .pipe(ejs({}))
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("dist"));
};

const clean = () => {
  return src(["dist/**/*.css", "dist/**/*.js", "dist/**/*.html"], {
    read: false,
  }).pipe(rimraf());
};

exports.clean = series(clean);
exports.build = series(css, javascript, html);
exports.default = function () {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });

  watch("src/sass/**/*.scss", series(css)).on("change", reload);
  watch("src/js/**/*.js", series(javascript)).on("change", reload);
  watch("src/**/*.ejs", series(html)).on("change", reload);
};
