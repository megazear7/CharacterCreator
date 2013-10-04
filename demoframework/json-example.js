
var database = "hackmaster"

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
    jQuery.getJSON("/cgi-bin/response.cgi?request=userUpdate&database="+ database +"&emailname="
    	+ userModel.emailname +"&password=" + userModel.password,
        function(jsonData) {
    })
}

function login(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=login&database="+ database +"&emailname="
    	+ userModel.emailname() +"&password=" + userModel.password(),
        function(jsonData) {

	
	// on success, switch around the logged in and logged out views
	var div = document.getElementById("login");
	div.style.display="none";
	div = document.getElementById("logout");
	div.style.display="inline";

    })


}

function logout(){
    // forget username, passwork, cookie

    // switch around the logged in and logged out views 
	var div = document.getElementById("logout");
	div.style.display="none";
	div = document.getElementById("login");
	div.style.display="inline";


}

function register(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=register&database="+ database +"&emailname="
    	+ userModel.emailname() +"&password=" + userModel.password(),
        function(jsonData) {
    })
}

function forgot(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=forgotLogin&database="+ database +"&emailname="+ userModel.emailname(),
        function(jsonData) {
    })
}

function loadDoc(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=loadDoc&database="+ database +"&docid=85a8384e94594",
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
    jQuery.post("/cgi-bin/response.cgi?request=saveDoc&database="+ database +"&docid=85a8384e94594",
    jsonData, function(returnedData) {
        // This callback is executed if the post was successful    
    })
}

