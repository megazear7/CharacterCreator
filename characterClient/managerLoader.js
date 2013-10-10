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
			
			if (jsonData.status == "failure") {
				alert("Wrong email or password");
				return;
			}

			viewModel.loggedInMember().username(jsonData.result.screenName);
			viewModel.loggedInMember().emailname(jsonData.result.emailname);
			viewModel.loggedInMember().userid(jsonData.result._id.$oid);
			viewModel.loggedInMember().isLoggedIn("loggedIn");

			loadMemberCharacterData(viewModel, viewModel.loggedInMember().userid());

			viewModel.goToCharacterList();


    })
}

function loadMemberCharacterData(viewModel, userid){
	// for reference: (name, race, characterClass, level, maxHealth, strength, constitution, dextarity, wisdom, intelegence, charisma, looks, honor)
	var temp;

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
			console.log(jsonData.result.results);
			//docModel.doclist(jsonData.result.results);
    })

	// Slighter
	temp = new Character();
	temp.constructor("Slighter", "Human", "Fighter", 4, 35, 13.45, 10.00, 12.12, 13.09, 8.90, 7.47, 9.07, 11.98);
	temp.addWeapon("longsword");
	temp.addWeapon("longsword");
	viewModel.characterList.push(temp);
}
