App = Ember.Application.create();

App.Router.map(function() {
    this.resource("sessions", {path: "/"});
});

App.SessionsController = Ember.ArrayController.extend({
    actions: {
        remove: function(session) {
            session.entityAspect.setDeleted();
            this.store.instance.saveChanges();
        }
    }
});

App.SessionsRoute = Ember.Route.extend({
    model: function() {
        var query = breeze.EntityQuery.from("sessions").toType("Session");
        return this.store.instance.executeQuery(query).then(function(data) {
            return data.results;
        });
    }
});

App.BreezeStore = Ember.Object.extend({
    instance: null,
    init: function() {
        var ds = new breeze.DataService({
            serviceName: 'api',
            hasServerMetadata: false,
            useJsonp: false
        });
        breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);
        this.instance = new breeze.EntityManager({dataService: ds});
        this.instance.metadataStore.addEntityType({
            shortName: "Session",
            namespace: "App",
            dataProperties: {
                id: { dataType: "Int64", isPartOfKey: true },
                name: { dataType: "String" }
            }
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
