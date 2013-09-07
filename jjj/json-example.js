
var AppViewModel = {
    firstName : ko.observable("Bert"),
    lastName : ko.observable("Smith"),
    pets : ko.observableArray(["Cat", "Dog", "Fish"]),
    type : "Customer"
};
AppViewModel.hasALotOfPets = ko.computed(function() {
    return this.pets().length > 2
}, AppViewModel)


// This contains a mix of observables, computed observables, 
// observable arrays, and plain values. You can convert it
// to a JSON string suitable for sending to the server using
// ko.toJSON as follows:

var jsonData = ko.toJSON(AppViewModel);
 
// Result: jsonData is now a string equal to the following value
// '{"firstName":"Bert","lastName":"Smith","pets":["Cat","Dog","Fish"],"type":"Customer","hasALotOfPets":true}'


function saveEvent(){
    jQuery.post("/cgi-bin/echo.pl", jsonData, function(returnedData) {
        // This callback is executed if the post was successful    
    })
}



