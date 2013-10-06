// View Model code. This is what holds and modifies the data based off of user interaction.

// custom bindingHandlers. One for the dialog window, one for the grid select
ko.bindingHandlers.DialogWindow = {
	//var self = this;
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		// To access all the bindings placed on this element do this:
		//var allBindings = allBindingsAccessor();
		//alert(allBindings.columns);

		// To access the view model object pass to apply bindings. I.e. in here it is "Character"
		//alert("viewModel = " +  viewModel.characterClass);
		
		// To access $root, $parent or $parents do this:
		// alert(bindingContext.$root.columns());

		//var internals = viewModel.contents.internalHtml(viewModel);
		
		//$(element).empty();		
		//$(element).append(internals);

		var width = $(element).parent().width();
		var totalColumns = bindingContext.$root.columns();
		var lanes = bindingContext.$root.lanes();
		var i = $(element).index();

		var row = Math.floor(i/totalColumns + 1);	
		var column = i%totalColumns + 1;

		var posRow = ((100/lanes)+(3*(100/lanes*(column-1))));
		var posCol = ((width / 20) + (width * (3/lanes) * (row-1)))+40;

		var dialogWidth = width/(lanes/2);

		$(element).css("width", dialogWidth);
		$(element).css("height", dialogWidth);
		$(element).css("left", posRow+"%");
		$(element).css("top",posCol);
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var width = $(element).parent().width();
		var totalColumns = bindingContext.$root.columns();
		var lanes = bindingContext.$root.lanes();
		var i = $(element).index();

		var row = Math.floor(i/totalColumns + 1);	
		var column = i%totalColumns + 1;

		var posRow = ((100/lanes)+(3*(100/lanes*(column-1))));
		var posCol = ((width / 20) + (width * (3/lanes) * (row-1)))+40;

		var dialogWidth = width/(lanes/2);

		$(element).css("width", dialogWidth);
		$(element).css("height", dialogWidth);
		$(element).css("left", posRow+"%");
		$(element).css("top",posCol);
    }
};

ko.bindingHandlers.GridSelect = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var numberOfOptions = bindingContext.$root.numberOfOptions();

		var that = this;
		var gridChanger = jQuery("<div>", {
			class: "gridSelect",
			height: numberOfOptions*11
		});

		for(var i = 0; i < numberOfOptions; i++){
			var gridDot = jQuery("<div>", {
				class: "gridSelectDot",
				value: i+1
			}).css("top", ((((96/numberOfOptions)*i)+2)+"%"));
			gridChanger.append(gridDot);
		}
		$(element).append(gridChanger);

		$("div", gridChanger).each(function(index) {
			$(this).hover(
				function() { $(this).prevAll().add(this).addClass("hoverGridSelect") },
                function() { $(this).prevAll().add(this).removeClass("hoverGridSelect") }                
            ).click(function() { 
				var columns = valueAccessor();
                columns(index+1);               // Write the new rating to it
				bindingContext.$root.characterList.valueHasMutated();
            });
		});
	},
    update: function(element, valueAccessor) {
        // Give the first x stars the "chosen" class, where x <= rating
        var observable = valueAccessor();
        $("div", element).each(function(index) {
            $(this).toggleClass("chosenGridSelect", index < observable());
        });
    }
};

function Member(){
	var self = this;
	this.username = ko.observable("");
	this.isLoggedIn = ko.observable("notLoggedIn");
	this.userid	= ko.observable("");

	this.constructor = function(username){
		this.username(username);
		this.isLoggedIn("loggedIn");
	}

	this.template = function(){
		return self.isLoggedIn();
	}

}

// This is a character object. It hold weapon data, this could return different template names for if you want to view 
// a entire page of this character or just a dialogWindow representation of this object or something else
function Character(name, race, characterClass){
	var self = this;
	this.bp = ko.observable(0);
	this.strength = ko.observable(0);
	this.name = ko.observable("");
	this.race = ko.observable("");
	this.characterClass = ko.observable("");
	this.level = ko.observable(0);
	this.maxHealth = ko.observable(0);
	this.strength(0);
	this.constitution = ko.observable(0);
	this.dextarity = ko.observable(0);
	this.wisdom = ko.observable(0);
	this.intelegence = ko.observable(0);
	this.charisma = ko.observable(0);
	this.looks = ko.observable(0);
	this.honor = ko.observable(0);

	this.constructor = function(name, race, characterClass, level, maxHealth, strength, constitution, dextarity, wisdom, intelegence, charisma, looks, honor){
		// Data from mongo:
		this.name(name);
		this.race(race);
		this.characterClass(characterClass);
		this.level(level);
		this.maxHealth(maxHealth);
		this.strength(strength);
		this.constitution(constitution);
		this.dextarity(dextarity);
		this.wisdom(wisdom);
		this.intelegence(intelegence);
		this.charisma(charisma);
		this.looks(looks);
		this.honor(honor);
	}

	this.type = ko.observable("characterPage");

	this.strInt = ko.computed(function(){
		return Math.floor(self.strength());
	});
	this.strDmgMod = ko.computed(function(){
		return Math.floor(3);
	})
	this.dexInt = ko.computed(function(){
		return Math.floor(self.dextarity());
	});
	this.intInt = ko.computed(function(){
		return Math.floor(self.intelegence());
	});
	this.wisInt = ko.computed(function(){
		return Math.floor(self.wisdom());
	});
	this.conInt = ko.computed(function(){
		return Math.floor(self.constitution());
	});
	this.charInt = ko.computed(function(){
		return Math.floor(self.charisma());
	});
	this.looksInt = ko.computed(function(){
		return Math.floor(self.looks());
	});
	this.honorInt = ko.computed(function(){
		return Math.floor(self.honor());
	});
	this.strDec = ko.computed(function(){
		return Math.floor(((self.strength() % 1).toFixed(2))*100);
	});
	this.dexDec = ko.computed(function(){
		return Math.floor(((self.dextarity() % 1).toFixed(2))*100);
	});
	this.intDec = ko.computed(function(){
		return Math.floor(((self.intelegence() % 1).toFixed(2))*100);
	});
	this.wisDec = ko.computed(function(){
		return Math.floor(((self.wisdom() % 1).toFixed(2))*100);
	});
	this.conDec = ko.computed(function(){
		return Math.floor(((self.constitution() % 1).toFixed(2))*100);
	});
	this.charDec = ko.computed(function(){
		return Math.floor(((self.charisma() % 1).toFixed(2))*100);
	});
	this.looksDec = ko.computed(function(){
		return Math.floor(((self.looks() % 1).toFixed(2))*100);
	});
	this.honorDec = ko.computed(function(){
		return Math.floor(((self.honor() % 1).toFixed(2))*100);
	});

	/*
	* Weapon stuff
	*/
	this.weaponList = ko.observableArray();

	this.addWeapon = function(weapon){
		self.weaponList.push(new Weapon(weapon));
	}

	/*
	* Spell stuff
	*/
	this.spellList = ko.observableArray();

	this.addSpell = function(spell){
		self.spellList.push(new Spell(spell));
	}

	// put functionality that is based on the character in here, then call it wherever it is needed
	
	/*
	* Character Creation Stuff
	*/

	this.applyCreationBindings = function(){
		$('.race_choice').click(function(){
			self.race($(this).text());
		});
		$('.class_choice').click(function(){
			self.characterClass($(this).text());
		});
		$('.starting_bp').click(function(){
			self.bp(50);
		});
		$('.save_stats').click(function(){
			self.strength(parseInt($('.str_roll').val()));
			self.dextarity(parseInt($('.dex_roll').val()));
			self.intelegence(parseInt($('.int_roll').val()));
			self.wisdom(parseInt($('.wis_roll').val()));
			self.constitution(parseInt($('.con_roll').val()));
			self.looks(parseInt($('.lks_roll').val()));
			self.charisma(parseInt($('.cha_roll').val()));
		});
		$('.choose_name').click(function(){
			self.name($('.name_chosen').val());
		});
	}


	// this function could be smart and determine the returned template type in some non static way
	// or new objects could be created (weapon, spell, ect.. ) and they could return different template type
	// there template could utalize different variables instead of name race and characterClass
	this.dialogWindowTemplateType = function(){
		return "plainCharacter";
	}
}

function combatProfile(character, weapon, armor, offHand, otherStatBonuses){
	this.character = character;
	this.weapon = weapon;
	this.armor = armor;
	this.offHand = offHand;
	this.otherStatBonuses = otherStatBonues;
}

// This is a spell object. It hold weapon data, this could return different template names for if you want to view 
// a entire page of this spell or just a dialogWindow representation of this object or something else
function Spell(name){
	this.name = ko.observable(name);
	this.spellpoints = ko.observable();
	this.description = ko.observable();

	this.info = [
		{name : "fireball", spellpoints : "100", description : "firey ball" },
		{name : "magicmissle", spellpoints : "100", description : "firey ball" },
		{name : "lightning", spellpoints : "100", description : "firey ball" },
		{name : "blast", spellpoints : "100", description : "firey ball" },
	]

	for(var i = 0; i < this.info.length; i++){
		if(this.info[i].name == name){
			this.name(this.info[i].name);
			this.spellpoints(this.info[i].spellpoints);
			this.description(this.info[i].description);
		}
	}

	this.someFunction = function(element){
		this.spellpoints("100");
	}

	this.dialogWindowTemplateType = function(){
		return "plainSpell";
	}
}

// This is a weapon object. It hold weapon data, this could return different template names for if you want to view 
// a entire page of this weapon or just a dialogWindow representation of this object or something else
function Weapon(name){

	this.name = ko.observable();
	this.damage = ko.observable();
	this.speed = ko.observable();
	this.reach = ko.observable();

	this.info = [
		{name : "longsword", damage : "2d8", speed : "12", reach : "3" },
		{name : "shortsword", damage : "2d6", speed : "11", reach : "2" },
		{name : "dagger", damage : "2d4", speed : "8", reach : "1" }
	]

	for(var i = 0; i < this.info.length; i++){
		if(this.info[i].name == name){
			this.name(this.info[i].name);
			this.damage(this.info[i].damage);
			this.speed(this.info[i].speed);
			this.reach(this.info[i].reach);
		}
	}

	this.someFunction = function(element){
	}

	this.dialogWindowTemplateType = function(){
		return "combatInfo";
	}
}

// This is the view model, from here all the functionality and data lies somewhere down stream
CharacterManagerViewModel = function(){
	var self = this;
	self.columns = ko.observable(5);
	self.numberOfOptions = ko.observable(10);

	self.navSummary = ko.observable("Character List");

	self.viewWidth = ko.observable($(".bodyContainer").width());

	self.lanes = ko.computed(function(){
		var lanes = 0;
		var lanes = self.columns() * 3 + 1;
		return lanes;
	});

	self.currentStep = 0;

	self.loggedInMember = ko.observable(new Member());

	self.characterList = ko.observableArray([
	]);

	self.weaponList = ko.observableArray([
	]);

	self.spellList = ko.observableArray([
	]);

	self.monsterList = ko.observableArray([
	]);

	self.loadInitData = function(){
		// in here load all the data you can before the user even logs in. This could be 
		// weapons, spells, monsters, and any sort of reference material
		loadWeaponData(this);
		loadSpellData(this);
	}

	self.login = function(){
		// right here you need to populate the view model with everything that is related to the member that just logged in
		console.log("blah");
		loadMemberData(self);
		loadMemberCharacterData(self);
		self.goToCharacterList();
	}

	self.register = function() {

		// JIM123 HERE when they click register, get the info they entered and send it accross so the server will create a member doc for them
		console.log("hello");
		jQuery.getJSON("/cgi-bin/response.cgi?request=register&database="+ "hackmaster" 
				+"&emailname=" + $('.loginEmailname').val() 
				+"&password=" + CryptoJS.SHA3($('.loginPassword').val(), { outputLength: 256 })
				+"&screenName=" + "default",
				function(jsonData) {
				console.log(jsonData);
    	})
 
	}

	this.saveCharacter = function(char){
		var jsonData = ko.toJSON(char);
		// JIM123 here is what I will send for a save document
		jQuery.post("/cgi-bin/response.cgi?request=saveDoc&database="+ "hackmaster"
			+"&userid=" + self.loggedInMember().userid(),
			jsonData, function(returnedData) {
			// This callback is executed if the post was successful    
			console.log(returnedData);
		})
	}

	self.dialogWindowTemplateType = function(item){
		return item.dialogWindowTemplateType();
	}

	self.mainTemplateType = function(item){
		return self.chosenView();
	}

	/*
	 * View Changes. This is where any "routes" should be put. I.e. if you add a new page it should either using a route that already exists here, or a new one
	 * will be needed to allow the user to get to the new page.
	 */

	/*
	* To go to a character pass in a character object into this function
	*/
	self.goToCharacter = function(character) { 
		self.goToCharacterChangeView(character.name());
		history.pushState({location: "character", name: character.name()}, character.type() + '/' + character.name(), character.type() + '/' + character.name());
	};
	self.goToCharacterChangeView = function(characterName) { 
		var character;
		for (var i = 0; i < self.characterList().length; i++) {
			if (self.characterList()[i].name() == characterName){
				character = self.characterList()[i];
			}
		}
		self.chosenView("emptyView"); 
		self.chosenViewData(character);
		self.chosenView(character.type()); 
		self.navSummary("Character List - " + character.name());
	};

	/*
	* To go to a specific step pass in a step object into this function
	*/
	self.goToStep = function(character) { 
		self.currentStep += 1;
		var stepName = "step" + self.currentStep;
		var useCharacter; 
		if (self.currentStep == 1) { 
			useCharacter = self.goToStepChangeView(character, stepName);
		} else {
			useCharacter = self.goToStepChangeView(character.name(), stepName);
		}
		history.pushState({location: "step", charName: useCharacter.name(), stepName: stepName}, stepName, stepName);
	};
	self.goToStepChangeView = function(characterName, stepName) { 

		self.chosenView("emptyView"); 

		var retChar;
		if (self.currentStep == 1) { 
			var newChar = new Character();
			self.chosenViewData(newChar);
			self.chosenView(stepName); 
			newChar.applyCreationBindings();
			newChar.name("newChar");
			self.characterList.push(newChar);
			retChar = newChar;
		} else {
			var character;
			for (var i = 0; i < self.characterList().length; i++) {
				if (self.characterList()[i].name() == characterName){
					character = self.characterList()[i];
				}
			}
			self.chosenViewData(character);
			self.chosenView(stepName); 

			character.applyCreationBindings();
			retChar = character;
		}

		self.navSummary("Character List - " + stepName);

		return retChar;
	};

	self.goToLogin = function(){
		self.goToLoginChangeView();
		history.pushState({location: "login"}, 'login', 'login');
	}
	self.goToLoginChangeView = function(){
		self.chosenView("emptyView"); 
		self.chosenView("loginPage"); 
		self.navSummary("Login");
	}

	/*
	 * This is the standard "go home" type of button. This always takes you to the character list screen
	 */
	self.goToCharacterList = function() {
		self.goToCharacterListChangeView();
		history.pushState({location: "characterList"}, 'characterList', 'characterList');
	};
	self.goToCharacterListChangeView = function() {
		self.chosenView("emptyView"); 
		self.chosenViewData(self.characterList());
		self.chosenView("characterList"); 
		self.navSummary("Character List");
	};

	/*
	 * This is the go to character create. This will put you at the character create screen step 1.
	 */
	self.goToCharacterCreate = function() {
		self.goToCharacterCreateChangeView();
		history.pushState({location: "create"}, 'create/step1', 'create/step1');
		self.currentStep = 1;
	};
	self.goToCharacterCreateChangeView = function() {
		self.chosenView("emptyView"); 
		self.chosenViewData(new Character());
		self.chosenView("step1"); 
		self.navSummary("Character - Create");
	};

	self.buyWeapon = function() {
		alert("hello");
	}

	window.addEventListener('popstate', function(event) {
		if(history.state && event.state){
			if(event.state.location == "characterList"){
				self.goToCharacterListChangeView();
			}
			if(event.state.location == "character"){
				self.goToCharacterChangeView(history.state.name);
			}
			if(event.state.location == "step"){
				self.goToStepChangeView(history.state.charName, history.state.stepName);
			}
			if(event.state.location == "create"){
				self.goToCharacterCreateNewChangeView();
			}
			if(event.state.location == "login"){
				self.goToLoginChangeView();
			}
		}
	});

	/*
	 * This changes the grid pages on page resizes.
	 */
	$(window).on("resize", function(){
		self.viewWidth($(".bodyContainer").width());
		self.characterList.valueHasMutated();
	});

	// Do this on initial creation of the view model
	self.chosenView = ko.observable("loginPage");
	self.chosenViewData = ko.observable();
	self.loadInitData();
	self.goToLogin();

}

$(document).ready(function(){
	ko.applyBindings(new CharacterManagerViewModel());

});
