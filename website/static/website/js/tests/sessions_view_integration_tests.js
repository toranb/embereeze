module('sessions view integration tests', {
    setup: function() {
        App.reset();
    },
    teardown: function() {
        $.mockjaxClear();
    }
});

test('will add a row for each session in the application', function() {
    var sessions = [{id: 1, name: 'first'}, {id: 2, name: 'last'}];
    stubEndpointForHttpRequest("/api/sessions/", sessions);
    visit("/");
    andThen(function() {
        var rows = find("table tr").length;
        equal(2, rows);
    });
});

test('delete button will remove session from application', function() {
    var sessions = [{id: 1, name: 'first'}, {id: 2, name: 'last'}];
    stubEndpointForHttpRequest("/api/sessions/", sessions);
    visit("/");
    andThen(function() {
        var rows = find("table tr").length;
        equal(2, rows);
    });
    click("table .delete:first");
    andThen(function() {
        var rows = find("table tr").length;
        equal(1, rows);
    });
});
