var viewModel = {
    firstName : ko.observable("Bert"),
    lastName : ko.observable("Smith"),
    pets : ko.observableArray(["Cat", "Dog", "Fish"]),
    type : "Customer"
};
viewModel.hasALotOfPets = ko.computed(function() {
    return this.pets().length > 2
}, viewModel)

//This contains a mix of observables, computed observables, observable arrays, and plain values. You can convert it to a JSON string suitable for sending to the server using ko.toJSON as follows:

var jsonData = ko.toJSON(viewModel);
 
// Result: jsonData is now a string equal to the following value
// '{"firstName":"Bert","lastName":"Smith","pets":["Cat","Dog","Fish"],"type":"Customer","hasALotOfPets":true}'

// Or, if you just want the plain JavaScript object graph before serialization, use ko.toJS as follows:

var plainJs = ko.toJS(viewModel);
 
// Result: plainJS is now a plain JavaScript object in which nothing is observable. It's just data.
// The object is equivalent to the following:
//   {
//      firstName: "Bert",
//      lastName: "Smith",
//      pets: ["Cat","Dog","Fish"],
//      type: "Customer",
//      hasALotOfPets: true
//   }

//Note that ko.toJSON accepts the same arguments as JSON.stringify. For example, it can be useful to have a “live” representation of your view model data when debugging a Knockout application. To generate a nicely formatted display for this purpose, you can pass the spaces argument into ko.toJSON and bind against your view model like:

<pre data-bind="text: ko.toJSON($root, null, 2)"></pre>



//Updating View Model Data using JSON

// If you’ve loaded some data from the server and want to use it to update your view model, the most straightforward way is to do it yourself. For example,

// Load and parse the JSON
var someJSON = /* Omitted: fetch it from the server however you want */;
var parsed = JSON.parse(someJSON);
 
// Update view model properties
viewModel.firstName(parsed.firstName);
viewModel.pets(parsed.pets);

//In many scenarios, this direct approach is the simplest and most flexible solution. Of course, as you update the properties on your view model, Knockout will take care of updating the visible UI to match it.

//However, many developers prefer to use a more conventions-based approach to updating their view models using incoming data without manually writing a line of code for every property to be updated. This can be beneficial if your view models have many properties, or deeply nested data structures, because it can greatly reduce the amount of manual mapping code you need to write. For more details about this technique, see the knockout.mapping plugin.
