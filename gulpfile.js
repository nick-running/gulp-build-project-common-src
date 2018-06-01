var gulp = require('gulp')
var _ = require('lodash')
var handlebars = require('gulp-compile-handlebars'),
  layouts = require('handlebars-layouts');

layouts.register(handlebars.Handlebars);

gulp.task('build', function () {
  var projects = {
    project1: {name: 'project1', type: 'type1'},
    project2: {name: 'project2', type: 'type2'}
  }
  var config = {
    projectName: projects.project1.name,
    app: {
      assetsStatic: '/static',
      assetsAliFonts: '/static/ali-fonts',
      assetsCss: '/static/css',
      assetsJs: '/static/js',
      assetsImg: '/static/images',
      assetsLib: '/static/lib'
    }
  }
  var handlebarOptions = {
    ignorePartials: true,
    batch: ['./src/views/partials'],
    helpers: {
      raw: function (options) { return options.fn(); }
    }
  }
  var hbSrc = gulp.src(['src/views/pages/**/*.html', 'src/views/pages/**/*.ejs'])
  var hbSrc2 = gulp.src(['src/views/pages/**/*.html', 'src/views/pages/**/*.ejs'])

  hbSrc.pipe(handlebars(config, handlebarOptions)).pipe(gulp.dest('dist'))

  var config2 = _.assignIn({}, config, {projectName: projects.project2.name})
  hbSrc2.pipe(handlebars(config2, handlebarOptions)).pipe(gulp.dest('dist2'))

});