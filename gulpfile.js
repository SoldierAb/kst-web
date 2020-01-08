const gulp = require('gulp'),
    scss = require('gulp-sass'),
    concat = require('gulp-concat'),
    cleanCss = require('gulp-clean-css'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefix = require('gulp-autoprefixer'),
    filter = require('gulp-filter'),
    inject = require('gulp-inject'),
    gulpif = require('gulp-if'),
    fs = require("fs"),
    del = require('del'),
    argv = require('yargs').argv,
    theme = process.env.npm_config_theme || 'default',
    { theme: allTheme,
        common: commonScss,
        themeTagId ,
        output,
        injectHtml,
        themeModuleBuild = false
    } = require('./theme.config.js'),
    node_env = argv.env || 'development',
    scss_path = ['src/**/*.scss', '!node_modules'],
    output_path_style = output.all,
    output_path_style_modules = `${output_path_style}/modules`,
    module_ext_name = `${node_env === 'production' ? '.min.css' : '.css'}`,
    concat_theme_name = (param) => `${param}${node_env === 'production' ? '.min' : ''}.css`;

const themeTask = async (done) => {
    cleanFiles();
    allTheme.forEach(item => {
        scssTask(item);
    });
    done()
}

const scssTask = (themeType = theme) => new Promise((resolve) => {
    bundleScss(themeType).on('end', () => {
        injectTask();
        resolve(true);
    })
})

const bundleScss = themeType => {
    const bundleGlob = [...scss_path, `!src/theme/mixins/**/*.scss`];
    return gulp.src(bundleGlob)
        .pipe(sourcemaps.init())
        .pipe(setGlobalScss(themeType))
        .pipe(scss().on('error', scss.logError))
        .pipe(gulpif(node_env === 'production', cleanCss())) // 仅在生产环境时候进行压缩
        .pipe(autoprefix())
        .pipe(gulpif(themeModuleBuild, rename((path) => {
            path.extname = module_ext_name
        })))
        .pipe(gulpif(themeModuleBuild, sourcemaps.write('./')))
        .pipe(gulpif(themeModuleBuild, gulp.dest(`${output_path_style_modules}/${themeType}`)))
        .pipe(gulpif(themeModuleBuild, filter(`**/*.css`)))   //合并过滤
        .pipe(concat(concat_theme_name(themeType)))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output_path_style))
}

// scss 全局变量注入
const setGlobalScss = (themeType) => {
    const resDefault = fs.readFileSync(`./src/theme/mixins/${themeType}.scss`).toString(),
        resCommon = Array.isArray(commonScss) ?
            commonScss.map(commonPath => {
                return fs.readFileSync(commonPath).toString()
            }).join(" \n ")
            : fs.readFileSync(commonScss).toString(),
        scssString = resCommon + " \n " + resDefault;

    return header(scssString);
}

const watchPipe = done => {
    const watcher = gulp.watch(scss_path);
    watcher.on("change", () => {
        themeTask(done)
    })
    watcher.on("add", () => {
        themeTask(done)
    })
    watcher.on("unlink", () => {
        themeTask(done)
    })
    done()
}

const cleanFiles = () => {
    return del(output_path_style, { read: false })
}

const injectTask = () => {
    const target = gulp.src(injectHtml),
        source = gulp.src([`${output_path_style}/${concat_theme_name(theme)}`], { read: false });

    return target.pipe(
        inject(source, {
            transform: function (filepath) {
                if (filepath.includes(`${theme}.css`)) {
                    const injectPath = `${filepath}`.replace(/\/public/g,'')
                    return `<link id="${themeTagId}"  rel="stylesheet" type="text/css" href="${injectPath}"></link>`
                }
                // Use the default transform as fallback:
                return inject.transform.apply(inject.transform, arguments);
            }
        }, { relative: true })
    ).pipe(gulp.dest('public'))
}

const jsTask = (done) => {
    gulp.src(`node_modules/kst-util/dist/umd/kst.min.js`)
        .pipe(gulp.dest('public'))
    done();
}

gulp.task('js', jsTask)
gulp.task('clean', cleanFiles)
gulp.task('watch', watchPipe)
gulp.task('theme', themeTask)
gulp.task('default', gulp.series('clean', gulp.parallel('theme', 'js'), 'watch'))
gulp.task('build', gulp.series('clean', gulp.parallel('theme', 'js')))
