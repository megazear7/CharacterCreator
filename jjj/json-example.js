
var userModel = {
    emailname : ko.observable("jrogers@gmail.com"),  
    password  : ko.observable("password"),
}

var AppViewModel = {
    firstName : ko.observable("Bert"),
    lastName : ko.observable("Smith"),
    type : ko.observable("Customer"),
    pets : ko.observableArray(["Cat", "Dog", "Fish"]),
};

function update(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=userUpdate&ID=85a8384e94594",
        function(jsonData) {
    })
}

function login(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=login",
        function(jsonData) {

	// on success, switch around the logged in and logged out views
    })
}

function logout(){
    // forget username, passwork, cookie

    // switch around the logged in and logged out views 
}

function register(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=register",
        function(jsonData) {
    })
}

function forgot(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=forgotLogin",
        function(jsonData) {
    })
}

function loadDoc(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=loadDoc&ID=85a8384e94594",
        function(jsonData) {
 
        AppViewModel.firstName(jsonData.firstName);
        AppViewModel.lastName(jsonData.lastName);
        AppViewModel.type(jsonData.type);
        AppViewModel.Quark = ko.observable(jsonData.Quark);
        AppViewModel.Quark = ko.observable(jsonData.Quark);
        AppViewModel.pets(jsonData.pets);
    })
}

function saveDoc(){
    var jsonData = ko.toJSON(AppViewModel);
    jQuery.post("/cgi-bin/response.cgi?request=saveDoc&ID=85a8384e94594",
    jsonData, function(returnedData) {
        // This callback is executed if the post was successful    
    })
}

