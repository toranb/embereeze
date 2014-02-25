document.write('<div id="ember-testing-container"><div id="wrap"></div></div>');

App.setupForTesting();
App.injectTestHelpers();

function stubEndpointForHttpRequest(url, json, verb, status) {
    $.mockjax({
        type: verb || "GET",
        url: url,
        status: status || 200,
        dataType: 'json',
        responseText: json
    });
}

$.mockjaxSettings.logging = false;
$.mockjaxSettings.responseTime = 0;
