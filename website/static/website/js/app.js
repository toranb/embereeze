App = Ember.Application.create();

App.Router.map(function() {
    this.resource("sessions", {path: "/"});
});

App.SessionsRoute = Ember.Route.extend({
    model: function() {
        var query = new breeze.EntityQuery().from("sessions");
        return this.store.executeQuery(query).then(function(response) {
            return response.results;
        });
    }
});

Ember.onLoad('Ember.Application', function(Application) {

    Application.initializer({
        name: "store",

        initialize: function(container, application) {
            application.register('store:main', App.BreezeStore);
        }
    });

    Application.initializer({
        name: "injectStore",
        before: "store",

        initialize: function(container, application) {
            application.inject('controller', 'store', 'store:main');
            application.inject('route', 'store', 'store:main');
        }
    });

});

App.BreezeStore = Ember.Object.extend({
    instance: null,
    init: function() {
        var ds = new breeze.DataService({
            serviceName: 'api',
            hasServerMetadata: false,
            useJsonp: false
        });
        this.instance = new breeze.EntityManager({dataService: ds});
        this.instance.metadataStore.addEntityType({
            shortName: "Session",
            namespace: "App",
            dataProperties: {
                id:         { dataType: breeze.DataType.Int64, isPartOfKey: true },
                name:       { dataType: breeze.DataType.String }
            }
        });
    },
    executeQuery: function(query) {
        //clearly a hack ...
        return this.instance.executeQuery(query);
    }
});
