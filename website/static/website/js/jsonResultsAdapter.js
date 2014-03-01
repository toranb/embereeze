// This is an AMD module, convert this to the way Ember wants it to use it
define([], new breeze.JsonResultsAdapter({

    // Namespace
    name: "App",

    extractResults: function (data) {
        var results = data.results;
        if (!results) throw new Error("Unable to resolve 'results' property");
        // Here, we will extract results to pass to the visitNode function
        // Since your JSON doesn't appear to have any descriptive way of determining
        // which nodes to send, try just sending results and debugging when it hits 
        // visit node.  If that isn't hitting the right nodes, you may need to play 
        // with this by using something like results.sessions to find the right nodes
        return results;
    },

    visitNode: function (node, mappingContext, nodeContext) {
        // If the node has a speakers property,
        if (node.speakers) {
            // Map the speaker to a DTO of a speaker
            var tempSpeakers = [];
            // Assuming your using jQuery, if not use this as pseudo-code
            $.each(node.speakers, function (index, item) {
                tempSpeakers.id = item;
            });
            // After mapping the dto's, set it back to the property for Breeze,
            node.speakers = tempSpeakers;
            // Then help let Breeze know this was a session we just wired up
            // Since we are customizing how Breeze treats this node we need to 
            // provide this *I believe*
            return { entityType: "Session" };
        }
    }
}));