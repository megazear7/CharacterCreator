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

		var width = bindingContext.$root.viewWidth();
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
		var width = bindingContext.$root.viewWidth();
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

	// put functionality that is based on the character in here, then call it wherever it is needed
	this.rename = function(element){
		this.name("Bob");
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
function Spell(name, spellpoints, description){
	this.name = ko.observable(name);
	this.spellpoints = ko.observable(spellpoints);
	this.description = ko.observable(description);

	this.someFunction = function(element){
		this.spellpoints("100");
	}

	this.dialogWindowTemplateType = function(){
		return "plainSpell";
	}
}

// This is a weapon object. It hold weapon data, this could return different template names for if you want to view 
// a entire page of this weapon or just a dialogWindow representation of this object or something else
function Weapon(name, damage, speed){
	this.name = ko.observable(name);
	this.damage = ko.observable(damage);
	this.speed = ko.observable(speed);

	this.someFunction = function(element){
		this.damage("2d6");
	}

	this.dialogWindowTemplateType = function(){
		return "combatInfo";
	}
}

// This is a object that is a character creator step. For customized steps the templates need changed, and then create a 
// new instance of this object with a stepName coorosponding to the template
function characterCreationStep(name, description, stepName){
	var self = this;
	this.name = ko.observable(name);
	this.stepName = ko.observable(stepName);
	this.description = ko.observable(description);
	this.message = ko.observable();
	
	this.type = function(){
		return self.stepName();	
	}	

	this.dialogWindowTemplateType = function(){
		return "characterCreationStepDialog";
	}

	this.someFunction = function(e){
		this.message("You marked this as complete");
	}
}

// This is the new character button
function newCharacter(){

	this.someFunction = function(element){
	}

	this.dialogWindowTemplateType = function(){
		return "newCharacter";
	}
}

// This is the view model, from here all the functionality and data lies somewhere down stream
function CharacterManagerViewModel() {
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

	self.loggedInMember = ko.observable(new Member());

	self.characterList = ko.observableArray([
	]);

	self.weaponList = ko.observableArray([
	]);

	self.spellList = ko.observableArray([
	]);

	self.monsterList = ko.observableArray([
	]);

	self.createOptions = ko.observableArray([
		new characterCreationStep("Step 1", "Recieve Building Points", "step1"),
		new characterCreationStep("Step 2", "Roll Ability Scores", "step2"),
		new characterCreationStep("Step 3", "Arange Ability Scores", "step3"),
		new characterCreationStep("Step 4", "Chose a Race", "step4"),
		new characterCreationStep("Step 5", "Finalize Ability Scores and Other Adjustments", "step5"),
		new characterCreationStep("Step 6", "Choose a Class and Alignment", "step6"),
		new characterCreationStep("Step 7", "Determine Priors and Particulers", "step7"),
		new characterCreationStep("Step 8", "Determine Quirks and Flaws", "step8"),
		new characterCreationStep("Step 9", "Calculate Starting Honor", "step9"),
		new characterCreationStep("Step 10", "Purchase Skills Talents and Proficiencies", "step10"),
		new characterCreationStep("Step 11", "Roll Hit Points", "step11"),
		new characterCreationStep("Step 12", "Recueve Starting Money and Equip Character", "step12"),
		new characterCreationStep("Finish Character Creation", "this needs to be a actual finish button that finishes creating the character and takes you back to the character select page with the newly created character added on", "stepFinish")
	]);

	self.loadInitData = function(){
		// in here load all the data you can before the user even logs in. This could be 
		// weapons, spells, monsters, and any sort of reference material
		loadWeaponData(this);
		loadSpellData(this);
	}

	self.login = function(){
		// right here you need to populate the view model with everything that is related to the member that just logged in
		loadMemberData(self);
		loadMemberCharacterData(self);
		self.goToCharacterList();
	}

	// Do this on initial creation of the view model
	self.chosenView = ko.observable("loginPage");
	self.chosenViewData = ko.observable();
	self.loadInitData();

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
	 * Standard go to view. This is the standard go to view, whatever is given as folder will need to return its type, which is the template name required for the
	 * data in folder to be correctly viewed.
	 */
	self.goToView = function(folder, data) { 
		// this is required because the chosen view (folder.type()) is dependant upon the data (folder), however the data is also dependant on the chosen view.
		// So the best way to avoid error is to set the view to the empty view which has no dependencies. Then change the data, then change the view to match.
		// Lastly change the navSummary to reflect the changes. Make sure these steps are followed in this manor. There should never be anything other than these
		// four steps in these "view change" methods.
		self.chosenView("emptyView"); 
		self.chosenViewData(folder);
		self.chosenView(folder.type()); 
		self.navSummary("Character List - " + folder.name());
		// pushState does not work on the file:// url scheme. So I can't test it right now
		history.pushState({id: 'someid'}, '', 'file:///C:/Users/Alex/src/CharacterCreator/characterManager.html/' + folder.type() + '/' + folder.name());
	};

	/*
	 * This is the standard "go home" type of button. This always takes you to the character list screen
	 */
	self.goToCharacterList = function() {
		self.chosenView("emptyView"); 
		self.chosenViewData(self.characterList());
		self.chosenView("characterList"); 
		self.navSummary("Character List");
		history.pushState({id: 'someid'}, '', 'file:///C:/Users/Alex/src/CharacterCreator/characterManager.html/characterList');
	};

	/*
	 * This is the go to character create. This will put you at the character create screen.
	 */
	self.goToCharacterCreate = function() {
		self.chosenView("emptyView"); 
		self.chosenViewData(self.createOptions());
		self.chosenView("characterCreate"); 
		self.navSummary("Character - Create");
		history.pushState({id: 'someid'}, '', 'file:///C:/Users/Alex/src/CharacterCreator/characterManager.html/create');
	};

	/*
	 * This changes the grid pages on page resizes.
	 */
	$(window).on("resize", function(){
		self.viewWidth($(".bodyContainer").width());
		self.characterList.valueHasMutated();
	});

	// Client-side routes    
	// this is not yet implemented. The problem is the "this.get" methods need to have data passes in (i.e. the data that will replace the modelViewData
	// but as of not the only paramaters the callback function has is the string that comes after the "#"
	/*
	Sammy(function() {
		this.get('#:characterList', function(context) {
			console.log(context);
			console.log(self.characterList());
		});
		this.get('#:characterList/:characterName', function() {
			console.log(self.characterList[this.params.characterName]);
		});
		this.get('#:folder/:mailId', function() {
			//self.chosenFolderId(this.params.folder);
			//self.chosenFolderData(null);
			//$.get("/mail", { mailId: this.params.mailId }, self.chosenMailData);
		});

		this.get('', function() { this.app.runRoute('get', '#Inbox') });
	}).run(); 
	*/

}

$(document).ready(function(){
	ko.applyBindings(new CharacterManagerViewModel());

});
