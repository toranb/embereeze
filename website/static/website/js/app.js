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
            console.log(data);
            return data.results;
        });
    }
});

App.BreezeStore = Ember.Object.extend({
    instance: null,
    init: function() {        
        var jsonResultsAdapter = new breeze.JsonResultsAdapter({
            name: "App",
            extractResults: function (data) {
                var results = data.results;
                if (!results) throw new Error("Unable to resolve 'results' property");
                return results;
            },
            visitNode: function (node, mappingContext, nodeContext) {
                // If the node has a speakers property,
                if (node.speakers) {
                    // Map the speaker to a DTO of a speaker
                    var tempSpeakers = [];
                    // Assuming your using jQuery, if not use this as pseudo-code
                    $.each(node.speakers, function (index, item) {
                        tempSpeakers.push({ id: item });
                    });
                    // After mapping the dto's, set it back to the property for Breeze,
                    node.speakers = tempSpeakers;
                    return { entityType: "Session" };
                }
            }
        });
        var ds = new breeze.DataService({
            serviceName: 'api',
            hasServerMetadata: false,
            useJsonp: false,
            jsonResultsAdapter: jsonResultsAdapter
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
                sessionModel: {
                    entityTypeName: "Session", isScalar: true,
                    associationName: "Session_Speakers", foreignKeyNames: ["session"]
                }
            }
        });
        this.instance.metadataStore.addEntityType({
            shortName: "Session",
            namespace: "App",
            dataProperties: {
                id: { dataType: "Int64", isPartOfKey: true },
                name: { dataType: "String" }
            },
            navigationProperties: {
                speakers: {
                    entityTypeName: "Speaker", isScalar: false,
                    associationName: "Session_Speakers"
                }
            }
        });
        var Speaker = function () {
            this.isIdOnly = true;
        }
        this.instance.metadataStore.registerEntityTypeCtor("Speaker", Speaker, speakerInitializer);
        function speakerInitializer (speaker) {
            console.log('Initializing a speaker');
            // If the session is only an Id,
            if (speaker.isIdOnly) {
                // Go load it
                // var query = breeze.EntityQuery.from("speakers").toType("Speaker");
                // return this.store.executeQuery(query).then(function(data) {
                //     console.log(data);
                //     return data.results;
                // });
            }
        }
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
