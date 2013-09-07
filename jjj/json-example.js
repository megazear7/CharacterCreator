
var AppViewModel = {
    firstName : ko.observable("Bert"),
    lastName : ko.observable("Smith"),
    pets : ko.observableArray(["Cat", "Dog", "Fish"]),
    type : "Customer"
};
AppViewModel.hasALotOfPets = ko.computed(function() {
    return this.pets().length > 2
}, AppViewModel)

function loadEvent(){
    jQuery.getJSON("/cgi-bin/echo.cgi", function(jsonData) {
        //  update posts using returned json DAta   
        var parsed = JSON.parse(jsonData);
 
        // Update view model properties
        AppViewModel.firstName(parsed.firstName);
        AppViewModel.pets(parsed.pets);
    })
}

function saveEvent(){
    var jsonData = ko.toJSON(AppViewModel);
    jQuery.post("/cgi-bin/echo.cgi", jsonData, function(returnedData) {
        // This callback is executed if the post was successful    
    })
}

