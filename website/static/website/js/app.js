App = Ember.Application.create();

App.Router.map(function() {
    this.resource("sessions", {path: "/"});
});

App.SessionsController = Ember.ArrayController.extend({
    actions: {
        remove: function(session) {
            session.entityAspect.setDeleted();
            this.store.saveEntity(session);
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
                return results && (results || results.speakers);
            },
            visitNode: function (node, mappingContext, nodeContext) {
                // If the node has a speakers property,
                if (node.speakers) {
                    // Map the speaker to a DTO of a speaker
                    var tempSpeakers = [];
                    // // Assuming your using jQuery, if not use this as pseudo-code
                    $.each(node.speakers, function (index, item) {
                        tempSpeakers.push({ id: item });
                    });
                    // // After mapping the dto's, set it back to the property for Breeze,
                    node.speakers = tempSpeakers;
                    return { entityType: "Session" };
                } else {
                    console.log('Found a speaker - ', node);
                    console.log('Speakers session - ', node.session);
                    return { entityType: "Speaker" };
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
        // Speaker entity
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
        // Session entity
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
        var self = this; 
        function speakerInitializer (speaker) {
            // If the session is only an Id,
            if (speaker.isIdOnly) {
                // Go load it
                var resourcePath = "speakers/" + speaker.id;
                var query = breeze.EntityQuery.from(resourcePath).toType("Speaker");
                return self.instance.executeQuery(query).then(function(data) {
                    var thisSpeaker = data.results[0];
                    console.log('This speaker was returned - ', thisSpeaker);
                    thisSpeaker.isIdOnly = false;
                    return thisSpeaker;
                });
            }
        }
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
