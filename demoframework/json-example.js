
var database = "hackmaster";
var documentID = "5254f77a1ad417d628000000";
//var documentID = 0;

var userModel = {
    emailname  : ko.observable("a@gmail.com"),  
    password   : ko.observable("password"),
    screenName : ko.observable("Bob"),
    userid     : ko.observable(""),
    lastStatus : ko.observable("Enter an email and password"),
};

var docModel = {
	doclist : ko.observableArray(["test", "test"]),
};

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
    	+"&password=" + CryptoJS.SHA3(userModel.password(), { outputLength: 256 })
    	,
        function(jsonData) {

	// Report status
	userModel.lastStatus(jsonData.msg);

	// Need to check the return status in the json 
	if (jsonData.status == "failure"){
		//abort on failure
		return;
	}
	
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
    	+"&emailname="+ userModel.emailname()
    	,
        function(jsonData) {
    })

}

function logout(){

    // switch around the logged in and logged out views 
	var div = document.getElementById("logout");
	div.style.display="none";
	div = document.getElementById("login");
	div.style.display="inline";

    // forget username, passwork, cookie
	userModel.emailname("");
	userModel.password("");
	userModel.screenName("");
	userModel.userid("");
	userModel.lastStatus("Enter an email address and password to login.");
	
	eraseCookie("SessionId");
}

// Cookie functions.
// from here: http://stackoverflow.com/questions/2144386/javascript-delete-cookie

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}


function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

// execute this fuction to run when window closes
// will not run on opera or chrome.
// will something else work on chrome?

window.onbeforeunload = function() {

	// save changed dataobjects?

	eraseCookie("SessionId");
	return null;
}

// Update User functions

function openUpdate(){

	var div = document.getElementById("logout");
	div.style.display="none";
	div = document.getElementById("update");
	div.style.display="inline";
}

function update(){
    jQuery.getJSON("/cgi-bin/response.cgi?request=userUpdate&database="+ database 
    	+"&userid=" + userModel.userid()
    	+"&emailname="+ userModel.emailname()
    	+"&password=" + CryptoJS.SHA3(userModel.password(), { outputLength: 256 })
    	+"&screenName=" + userModel.screenName()
    	,
        function(jsonData) {
        
        // Report status
	userModel.lastStatus(jsonData.msg);

	// Need to check the return status in the json 
	if (jsonData.status == "failure"){
		//abort on failure
		return;
	}
	
	cancelUpdate();
    })
}

function cancelUpdate(){

	var div = document.getElementById("update");
	div.style.display="none";
	div = document.getElementById("logout");
	div.style.display="inline";
}

// Register User Functions

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
    	+"&screenName=" + userModel.screenName()
    	,
        function(jsonData) {
        
        // Report status
	userModel.lastStatus(jsonData.msg);

	// Need to check the return status in the json 
	if (jsonData.status == "failure"){
		//abort on failure
		return;
	}	
	
	cancelReg();
	login();
    })
}

function cancelReg(){

	var div = document.getElementById("register");
	div.style.display="none";
	div = document.getElementById("login");
	div.style.display="inline";
}


// button functions

function ld(){

    loadDoc(userModel.userid(), documentID);
    
}

function sd(){
    var docid = saveDoc(userModel.userid(), documentID, ko.toJSON(AppViewModel));
}

// Application functions below

function loadDoc(userid, docid){

    jQuery.getJSON("/cgi-bin/response.cgi?request=loadDoc&database="+ database 
    	+"&userid=" + userid
    	+"&docid=" + docid
    	,
        function(jsonData) {

	// Need to check the return status in the json 
	if (jsonData.status == "failure"){
		//abort on failure
		return;
	}
 	// callback function to load data.
	ldfinish(jsonData);
    })
}

function ldfinish(jsonData){
    
        AppViewModel.firstName(jsonData.results.firstName);
        AppViewModel.lastName(jsonData.results.lastName);
        AppViewModel.type(jsonData.results.type);
        //AppViewModel.Quark = ko.observable(jsonData.Quark);
        AppViewModel.pets(jsonData.results.pets);
}

//userModel.userid(), docid, var jsonData = ko.toJSON(AppViewModel);
function saveDoc(userid, docid, jsonData){

    jQuery.post("/cgi-bin/response.cgi?request=saveDoc&database="+ database 
    	+"&userid=" + userid
    	+"&docid="  + docid
    	,
        jsonData, function(retData) {
        // This callback is executed if the post was successful    
        
	// Need to check the return status in the json 
	if (jsonData.status == "failure"){
		return;
	}
	// callback function to load data.
	
    })
}

function dld(){
	loadDocList(userModel.userid());
}

function loadDocList(userid){

    jQuery.getJSON("/cgi-bin/response.cgi?request=loadDocList&database="+ database 
    	+"&userid=" + userid
    	,
        function(jsonData) {

	// Need to check the return status in the json 
	if (jsonData.status == "failure"){
		//abort on failure
		return;
	}
	// callback function to load data.
        docModel.doclist(jsonData.result);
    })
}

