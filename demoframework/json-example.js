
var database = "hackmaster"

var userModel = {
    emailname  : ko.observable("a@gmail.com"),  
    password   : ko.observable("password"),
    screenName : ko.observable("Bob"),
    userid     : ko.observable(""),
    lastStatus : ko.observable("Select an Option."),
}

var AppViewModel = {
    firstName : ko.observable("Bert"),
    lastName : ko.observable("Smith"),
    type : ko.observable("Customer"),
    pets : ko.observableArray(["Cat", "Dog", "Fish"]),
};

// User management functions

function login(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=login&database="+ database 
    	+"&emailname=" + userModel.emailname() 
    	+"&password=" + CryptoJS.SHA3(userModel.password(), { outputLength: 256 }),
        function(jsonData) {

	userModel.userid(jsonData.result._id.$oid);
	userModel.screenName(jsonData.result.screenName);
	// on success, switch around the logged in and logged out views
	var div = document.getElementById("login");
	div.style.display="none";
	div = document.getElementById("logout");
	div.style.display="inline";
    })
}


function forgot(){

    jQuery.getJSON("/cgi-bin/response.cgi?request=forgotLogin&database="+ database 
    	+"&emailname="+ userModel.emailname(),
        function(jsonData) {
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

function openUpdate(){

	var div = document.getElementById("logout");
	div.style.display="none";
	div = document.getElementById("update");
	div.style.display="inline";
}

function update(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=userUpdate&database="+ "hackmaster" 
    	+"&userid=" + userModel.userid()
    	+"&emailname="+ userModel.emailname ()
    	+"&password=" + CryptoJS.SHA3(userModel.password(), { outputLength: 256 })
    	+"&screenName=" + userModel.screenName()
    	,
        function(jsonData) {
    })
    
    cancelUpdate();
}


function cancelUpdate(){

	var div = document.getElementById("update");
	div.style.display="none";
	div = document.getElementById("logout");
	div.style.display="inline";
}

// Registration Functions

function openReg(){

	var div = document.getElementById("login");
	div.style.display="none";
	div = document.getElementById("register");
	div.style.display="inline";
}

function register(){

    jQuery.getJSON("/cgi-bin/response.cgi?request=register&database="+ database 
    	+"&emailname=" + userModel.emailname() 
    	+"&password=" + CryptoJS.SHA3(userModel.password(), { outputLength: 256 })
    	+"&screenName=" + userModel.screenName(),
        function(jsonData) {
    })
    
    cancelReg();
    login();
}

function cancelReg(){

	var div = document.getElementById("register");
	div.style.display="none";
	div = document.getElementById("login");
	div.style.display="inline";
}



// Application functions below

function loadDoc(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=loadDoc&database="+ database 
    	+"&userid=" + userModel.userid(),
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
    jQuery.post("/cgi-bin/response.cgi?request=saveDoc&database="+ database 
    	+"&userid=" + userModel.userid(),
        jsonData, function(returnedData) {
        // This callback is executed if the post was successful    
    })
}

