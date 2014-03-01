App = Ember.Application.create();

App.Router.map(function() {
    this.resource("sessions", {path: "/"});
});

App.SessionsController = Ember.ArrayController.extend({
    actions: {
        remove: function(session) {
            session.entityAspect.setDeleted();
            this.store.service.saveChanges();
        }
    }
});

App.SessionsRoute = Ember.Route.extend({
    model: function() {
        var query = breeze.EntityQuery.from("sessions").toType("Session");
        return this.store.executeQuery(query).then(function(data) {
            return data.results;
        });
    }
});

App.BreezeStore = Ember.Object.extend({
    instance: null,
    service: null,
    init: function() {
        this.service = new breeze.DataService({
            serviceName: 'api',
            hasServerMetadata: false,
            useJsonp: false
        });
        breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);
        breeze.config.initializeAdapterInstance("ajax", "jQuery", false);
        breeze.NamingConvention.camelCase.setAsDefault();
        this.instance = new breeze.EntityManager({dataService: this.service});
        this.instance.metadataStore.addEntityType({
            shortName: "Session",
            namespace: "App",
            dataProperties: {
                id: { dataType: "Int64", isPartOfKey: true },
                name: { dataType: "String" }
            }
        });
        this.instance.metadataStore.registerEntityTypeCtor(
            'Session', null, sessionInitializer);
        function sessionInitializer(session) {
            session.wat = 'omg';
        }
    },
    executeQuery: function(query) {
        //clearly a hack ...
        return this.instance.executeQuery(query);
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
