// This file will be responsible for supplying the CharacterManagerViewModel with all the needed data.
// I.E. it needs to populate:
//  member data (not that we have any idea of what that looks like yet)
//  character data (for that member)
//  "static" data (maybe weapon / armor / item data and maybe monster data ect...)
//  I think that is it...

var database = "hackmaster"

function loadWeaponData(viewModel){
	// so if i hard code all the weapon data, then i think i will still want managermodel to have an array of it.
	// so i create it all. this is a terrible way of doing this but for now... i guess it works
	var temp = new Weapon("longsword");
	viewModel.weaponList.push(temp);		
	temp = new Weapon("dagger");
	viewModel.weaponList.push(temp);
	temp = new Weapon("shortsword");
	viewModel.weaponList.push(temp);
}

function loadSpellData(viewModel){
	// so if i hard code all the spell data, then i think i will still want managermodel to have an array of it.
	// so i create it all. this is a terrible way of doing this but for now... i guess it works
	var temp = new Spell("Fireball", "160", "Shoots an awesome fireball");
	viewModel.spellList.push(temp);
	temp = new Spell("Magic Missle", "50", "ignores armor reduction");
	viewModel.spellList.push(temp);
	temp = new Spell("Fire Hands", "140", "ignores armor reduction");
	viewModel.spellList.push(temp);
}

function loadMemberData(viewModel){

	// JIM123 HERE !!! when the member clicks login, get the email and password, send it across to the server, and get back the needed stuff
    jQuery.getJSON("/cgi-bin/response.cgi?request=login&database="+ database 
    	+"&emailname=" + $('.loginEmailname').val() 
    	+"&password=" + CryptoJS.SHA3($('.loginPassword').val(), { outputLength: 256 }),
        function(jsonData) {

			console.log(jsonData);
			
			viewModel.loggedInMember().username(jsonData.result.screenName);
			viewModel.loggedInMember().emailname(jsonData.result.emailname);
			viewModel.loggedInMember().userid(jsonData.result._id.$oid);
			viewModel.loggedInMember().isLoggedIn("loggedIn");

			loadMemberCharacterData(viewModel, viewModel.loggedInMember().userid());
    })


	// down here all the documents attached to this member need to be loaded
			/*
    jQuery.getJSON("/cgi-bin/response.cgi?request=loadDoc&database="+ database 
    	+"&userid=" + viewModel.loggedInMember.userid(),
        function(jsonData) {
 
			var temp = new Member();
			temp.constructor("Megazear7");
			viewModel.loggedInMember(temp);

			AppViewModel.firstName(jsonData.firstName);
			AppViewModel.lastName(jsonData.lastName);
			AppViewModel.type(jsonData.type);
			AppViewModel.Quark = ko.observable(jsonData.Quark);
			AppViewModel.Quark = ko.observable(jsonData.Quark);
			AppViewModel.pets(jsonData.pets);
    })
			*/


}

function loadMemberDataNew(viewModel){
	var emailname = $(".loginEmailname").attr("value");
	var password = $(".loginPassword").attr("value");
    jQuery.getJSON("/cgi-bin/response.cgi?request=login&emailname="
    	+ emailname +"&password=" + password,
        function(jsonData) {
			var temp = new Member();
			temp.constructor("Megazear7");
			// will this reference to viewmodel here work inside a call back function?
			// the jsonData that we get back from here needs to add the newly created member
			// to the view model
			viewModel.loggedInMember(temp);
    })
}

function loadMemberCharacterData(viewModel, userid){
	// for reference: (name, race, characterClass, level, maxHealth, strength, constitution, dextarity, wisdom, intelegence, charisma, looks, honor)
	var temp;


		/*
    jQuery.getJSON("/cgi-bin/response.cgi?request=loadDoc&database="+ database 
    	+"&userid=" + userModel.userid(),
        function(jsonData) {
 
		temp = new Character();
		temp.constructor("Slighter", "Human", "Fighter", 4, 35, 13.45, 10.00, 12.12, 13.09, 8.90, 7.47, 9.07, 11.98);
		temp.addWeapon("longsword");
		temp.addWeapon("longsword");
		viewModel.characterList.push(temp);

        AppViewModel.firstName(jsonData.firstName);
        AppViewModel.lastName(jsonData.lastName);
        AppViewModel.type(jsonData.type);
        AppViewModel.Quark = ko.observable(jsonData.Quark);
        AppViewModel.Quark = ko.observable(jsonData.Quark);
        AppViewModel.pets(jsonData.pets);
    })
		*/

	// How do I get the docid's and userid?
	docid = 0;

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
    })

	// Slighter
	temp = new Character();
	temp.constructor("Slighter", "Human", "Fighter", 4, 35, 13.45, 10.00, 12.12, 13.09, 8.90, 7.47, 9.07, 11.98);
	temp.addWeapon("longsword");
	temp.addWeapon("longsword");
	viewModel.characterList.push(temp);

	// Wiz
	temp = new Character();
	temp.constructor("Wiz", "Elf", "Wizard", 4, 35, 13.45, 10.00, 12.12, 13.09, 8.90, 7.47, 9.07, 11.98);
	temp.addWeapon("dagger");
	temp.addSpell("fireball");
	viewModel.characterList.push(temp);

	//
	temp = new Character();
	temp.constructor("Mearth", "Human", "Cleric", 4, 35, 13.45, 10.00, 12.12, 13.09, 8.90, 7.47, 9.07, 11.98);
	viewModel.characterList.push(temp);
	temp.addWeapon("dagger");
	temp.addWeapon("dagger");
	temp.addSpell("fireball");
	temp.addSpell("fireball");
	temp.addSpell("fireball");
}
