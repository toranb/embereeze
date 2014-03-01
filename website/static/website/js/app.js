App = Ember.Application.create();

App.Router.map(function() {
    this.resource("sessions", {path: "/"});
});

App.SessionsController = Ember.ArrayController.extend({
    actions: {
        remove: function(session) {
            session.entityAspect.setDeleted();
            this.store.saveChanges();
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
    init: function() {
        var ds = new breeze.DataService({
            serviceName: 'api',
            hasServerMetadata: false,
            useJsonp: false
        });
        breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);
        this.instance = new breeze.EntityManager({dataService: ds});
        this.instance.metadataStore.addEntityType({
            shortName: "Speaker",
            namespace: "App",
            dataProperties: {
                id: { dataType: "Int64", isPartOfKey: true },
                name: { dataType: "String" },
		        session: { dataType: "Int64" }
            },
            navigationProperties: {
                session: {
                    entityTypeName: "Session", isScalar: true,
                    associationName: "session", foreignKeyNames: ["session"]
                }
            }
        });
        this.instance.metadataStore.addEntityType({
            shortName: "Session",
            namespace: "App",
            dataProperties: {
                id: { dataType: "Int64", isPartOfKey: true },
                name: { dataType: "String" },
                speakers: { dataType: "Undefined" }
            },
            navigationProperties: {
                speakers: {
                    entityTypeName: "Speaker", isScalar: false,
                    associationName: "speakers", foreignKeyNames: ["speakers"]
                }
            }
        });
    }
});

Ember.onLoad('Ember.Application', function(Application) {

    Application.initializer({
        name: "store",

        initialize: function(container, application) {
            var store = {
                create: function() {
                    return App.BreezeStore.create().instance;
                }
            };
            application.register('store:main', store);
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
