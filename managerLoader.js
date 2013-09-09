// This file will be responsible for supplying the CharacterManagerViewModel with all the needed data.
// I.E. it needs to populate:
//  member data (not that we have any idea of what that looks like yet)
//  character data (for that member)
//  "static" data (maybe weapon / armor / item data and maybe monster data ect...)
//  I think that is it...

function createViewModelData(){
    jQuery.getJSON("/cgi-bin/response.cgi", function(jsonData) {
        //  update posts using returned json DAta   
        var parsed = JSON.parse(jsonData);
 
        // Update view model properties
	
	// do such things as loop over every item in parsed.characters
	// building each character and adding it to CharacterManagerViewModel.characters (or something)
	
	// loop through item data (and other "static" data) and build the data into CharacterManagerViewModel so that users can pick out weapons and such

	// set member data. This might be such things as member profile name, some sort of status, messages or whatever else
   	
       // basically by the end of this CharacerMangagerViewModel should be fully populated.	
    })
}
