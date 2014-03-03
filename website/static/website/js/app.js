App = Ember.Application.create();

App.Router.map(function() {
    this.resource("sessions", {path: "/"});
});

App.SessionsController = Ember.ArrayController.extend({
    actions: {
        add: function() {
            var values = {name: this.get("name")};
            var session = this.store.createEntity("Session", values);
            var options = new breeze.SaveOptions({ resourceName: "Session" });
            this.store.saveChanges([session], options);
            //this fails now because ...
            //Cannot attach an object of type...to an EntityManager without first setting its key
        },
        remove: function(session) {
            session.entityAspect.setDeleted();
            var options = new breeze.SaveOptions({ resourceName: "Session" });
            this.store.saveChanges([session], options);
            //this fails now because it fires a POST to /api/Session
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
            shortName: "Session",
            namespace: "App",
            dataProperties: {
                id: { dataType: "Int64", isPartOfKey: true },
                name: { dataType: "String" }
            }
        });
    },
    saveEntity: function (entity) {
        var entityTypeName = entity.entityType.shortName
        var so = new SaveOptions({ resourceName: entityTypeName });
        myEntityManager.SaveChanges([entity], so );
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
