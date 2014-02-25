App = Ember.Application.create();

App.Router.map(function() {
    this.resource("sessions", {path: "/"});
});

App.SessionsRoute = Ember.Route.extend({
    model: function() {
        //move to an initializer of some kind (start)
        var ds = new breeze.DataService({
            serviceName: 'api',
            hasServerMetadata: false,
            useJsonp: false
        });
        var manager = new breeze.EntityManager({dataService: ds});
        App.BreezeFactory(manager.metadataStore);
        //move to an initializer (end)

        var query = new breeze.EntityQuery().from("sessions");
        return manager.executeQuery(query).then(function(response) {
            return response.results;
        });
    }
});

App.BreezeFactory = Ember.Object.extend({
    init: function(metadataStore) {
        metadataStore.addEntityType({
            shortName: "Session",
            namespace: "App",
            dataProperties: {
                id:         { dataType: breeze.DataType.Int64, isPartOfKey: true },
                name:       { dataType: breeze.DataType.String }
            }
        });
    }
});
