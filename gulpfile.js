const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
// const uglify = require("gulp-uglify-es").default;
// const imagemin = require("gulp-imagemin");
// const del = require("del");

gulp.task("css", async function () {
  const rev = (await import("gulp-rev")).default;
  console.log("Minifying css...");

  gulp
    .src("./assets/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest("./assets/css"));

  return gulp
    .src("./assets/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
});

gulp.task("js", async function () {
  const rev = (await import("gulp-rev")).default;
  const uglify = (await import("gulp-uglify")).default;
  console.log("minifying js...");

  return gulp
    .src("./assets/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
});

gulp.task("images", async function () {
  const rev = (await import("gulp-rev")).default;
  const imagemin = (await import("gulp-imagemin")).default;
  console.log("compressing images...");

  return gulp
    .src("./assets/**/*.+(png|jpg|gif|svg|jpeg)")
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
});

gulp.task("clean:assets", async function () {
  const del = (await import("del")).deleteAsync;
  return del(["./public/assets"]);
});

gulp.task(
  "build",
  gulp.series("clean:assets", "css", "js", "images"),
  function (done) {
    console.log("Building assets...");
    done();
  }
);
