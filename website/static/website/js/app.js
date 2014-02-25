App = Ember.Application.create();

App.Router.map(function() {
    this.resource("sessions", {path: "/"});
});

App.SessionsRoute = Ember.Route.extend({
    model: function() {
        var sessions = [];
        var ds = new breeze.DataService({
            serviceName: 'api',
            hasServerMetadata: false,
            useJsonp: false
        });
        var manager = new breeze.EntityManager({dataService: ds});
        var query = new breeze.EntityQuery().from("sessions");
        return manager.executeQuery(query).then(function(response){
            response.results.forEach(function(pojo){
                var session = Ember.Object.create(pojo);
                sessions.pushObject(session);
            });
            return sessions;
        });
    }
});
