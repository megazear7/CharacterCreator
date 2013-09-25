// This file will be responsible for supplying the CharacterManagerViewModel with all the needed data.
// I.E. it needs to populate:
//  member data (not that we have any idea of what that looks like yet)
//  character data (for that member)
//  "static" data (maybe weapon / armor / item data and maybe monster data ect...)
//  I think that is it...


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
	var temp = new Member();
	temp.constructor("Megazear7");
	viewModel.loggedInMember(temp);
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

function loadMemberCharacterData(viewModel){
	// for reference: (name, race, characterClass, level, maxHealth, strength, constitution, dextarity, wisdom, intelegence, charisma, looks, honor)
	var temp;

	/*
	* Slighter
	*/
	temp = new Character();
	temp.constructor("Slighter", "Human", "Fighter", 4, 35, 13.45, 10.00, 12.12, 13.09, 8.90, 7.47, 9.07, 11.98);
	temp.addWeapon("longsword");
	temp.addWeapon("longsword");
	viewModel.characterList.push(temp);

	/*
	* Wiz
	*/
	temp = new Character();
	temp.constructor("Wiz", "Elf", "Wizard", 4, 35, 13.45, 10.00, 12.12, 13.09, 8.90, 7.47, 9.07, 11.98);
	temp.addWeapon("dagger");
	temp.addSpell("fireball");
	viewModel.characterList.push(temp);

	/*
	* Mearth
	*/
	temp = new Character();
	temp.constructor("Mearth", "Human", "Cleric", 4, 35, 13.45, 10.00, 12.12, 13.09, 8.90, 7.47, 9.07, 11.98);
	viewModel.characterList.push(temp);
	temp.addWeapon("dagger");
	temp.addWeapon("dagger");
	temp.addSpell("fireball");
	temp.addSpell("fireball");
	temp.addSpell("fireball");
	viewModel.characterList.push(new newCharacter());
}
