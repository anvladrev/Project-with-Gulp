let gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');




gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade:true}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream:true}))
})
gulp.task('scripts', function(){
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/fullpage.js/dist/jquery.fullpage.min.js'         
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
})
gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});
gulp.task('clean', function(){
    return del.sync('dist');
})
gulp.task('clear', function(){
    return cache.clearAll();
})

gulp.task('img', function(){
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        scgoPlugins: [{removeViewBox:false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
})
gulp.task('watch', ['browser-sync', 'sass', 'scripts'] , function(){
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/*.html',browserSync.reload);
    gulp.watch('app/js/**/*.js',browserSync.reload);
    
});
gulp.task('build', ['clean','img', 'sass', 'scripts'], function(){
    
    let buildCss = gulp.src([
        'app/css/style.css',
        'app/css/libs.css'        
    ])
        .pipe(gulp.dest('dist/css'));
    
    let buildJs = gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('dist/js'));
       
    let buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});