App = Ember.Application.create();

App.Router.map(function() {
    this.resource("sessions", {path: "/"});
});

App.SessionsRoute = Ember.Route.extend({
    model: function() {
        var sessions = [];
        $.getJSON("/api/sessions/", function(response) {
            response.forEach(function(pojo) {
                var session = Ember.Object.create(pojo);
                sessions.pushObject(session);
            });
        });
        return sessions;
    }
});
