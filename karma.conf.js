module.exports = function(karma) {
    karma.set({
        basePath: 'website/static/website',

        files: [
          "js/vendor/jquery/jquery.min.js",
          "js/vendor/handlebars/handlebars.js",
          "js/vendor/ember/ember.js",
          "js/vendor/breeze/Samples/Edmunds/Edmunds/Scripts/q.min.js",
          "js/vendor/breeze/Breeze.Client/Scripts/breeze.min.js",
          "js/vendor/jquery-mockjax/jquery.mockjax.js",
          "js/app.js",
          "js/tests/integration_test_helper.js",
          "js/tests/sessions_view_integration_tests.js",
          "js/templates/*.handlebars",
        ],

        reporters: ['progress'],

        port: 9876,
        runnerPort: 9100,
        colors: true,

        logLevel: karma.LOG_ERROR,

        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        autoWatch: false,
        singleRun: true,

        frameworks: ["qunit"],

        plugins: [
            'karma-qunit',
            'karma-chrome-launcher',
            'karma-ember-preprocessor',
            'karma-phantomjs-launcher'
        ],

        preprocessors: {
            "**/*.handlebars": 'ember'
        }
    });
};
