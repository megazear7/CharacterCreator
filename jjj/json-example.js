
var AppViewModel = {
    firstName : ko.observable("Bert"),
    lastName : ko.observable("Smith"),
    type : ko.observable("Customer"),
    pets : ko.observableArray(["Cat", "Dog", "Fish"]),
};

function loadEvent(){
    jQuery.getJSON("/cgi-bin/response.cgi", function(jsonData) {
        //  update posts using returned json DAta   
        var parsed = JSON.parse(jsonData);
 
        // Update view model properties
        AppViewModel.firstName(parsed.firstName);
        AppViewModel.lastName(parsed.lastName);
        AppViewModel.type(parsed.type);
        AppViewModel.pets(parsed.pets);
    })
}

function saveEvent(){
    var jsonData = ko.toJSON(AppViewModel);
    jQuery.post("/cgi-bin/response.cgi", jsonData, function(returnedData) {
        // This callback is executed if the post was successful    
    })
}

