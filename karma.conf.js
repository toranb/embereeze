module.exports = function(karma) {
    karma.set({
        basePath: 'website/static/website',

        files: [
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

        frameworks: ['qunit']
    });
};
