
User View Model:

emailName text 

password text

Register Button  -> adds email address and cryptographic hashed password to mongo user database as a document.
Could send a confirmation email with a link to complete registration.

Once a user is registered they can perform the following:

Login  Button ->  send email address and hashed password which is confirmed against mongo database. A cookie is set on the browser as a session ID and a list of documents that are owned is returned as a json jquery result.  This document list is stored in a document manager viewModel.  Hide the login section and show the logout section.

Forgot  Button -> given an email address, if that user exists in the database, send an email to them. Always return a success and make sure all paths take the same amount of time.


Logout Button ->  Forget the cookie, save the document if  clear emailaddy and password, hide logout section, show login section.

Update Button -> Update the username and password associated with the current address.  Send an email to the old address stating what the email address was changed to. Low priority. 


Document Manager View Model:

Dropdown to select document.

Load Button -> Load the selected document into the browser.

Save Button ->  Save the document from the browser to the server.

Create Button -> Create a new document on the server and add it to the list of supported documents.


Document View Model:

Could have an array of these and create div's on the fly to display as many as we want.

Data driven control creation. 


-----------------------------------------


Running into this issue:

I had trouble getting the actuall document id from the insert is is in a strange format like the following:

bless( {
         'value' => '5254f191c1b45b0c27000000'
       }, 'MongoDB::OID' )



See how the docid is buried in that object?

I choose to just get a substring using this command: 


# insert
	        my $id = $UserCollection->insert( $jsonData );
	        
	        # check error value
		
		my $tmp = Dumper($id);
		
		$docid = substr($tmp, 30, 24);
		
--
		
The danger with this is how guaranteed am I of the length?

If instead I split on single quotes then I could just take the 4th of 5 parts.

--

Ideally I should just know how to pull out the key value pair directly from the data structure.

The best way would be to just set $docid using some hash reference.


-------------------------------------------------------------

{
  'ok' => '1',
  'n' => 0,
  'connectionId' => 285,
  'err' => undef,
  'updatedExisting' => bless( do{\(my $o = 0)}, 'boolean' )
}

{"status" : "success", "msg" : "handled createDoc request", "result" :  [  ] }jrogers@jrogers-1015PX:~/Documents/Books/Computer/CharacterCreator/demoframework$ ./test.cgi
Possible unintended interpolation of @gmail in string at ./test.cgi line 31.
Name "main::gmail" used only once: possible typo at ./test.cgi line 31.
{
  'ok' => '1',
  'n' => 1,
  'connectionId' => 286,
  'err' => undef,
  'updatedExisting' => bless( do{\(my $o = 1)}, 'boolean' )
}

{"status" : "success", "msg" : "handled createDoc request", "result" :  [ {"$oid":"5254f77a1ad417d628000000"} ] }


jrogers@jrogers-1015PX:~/Documents/Books/Computer/CharacterCreator/demoframework$ ./test.cgi
Possible unintended interpolation of @gmail in string at ./test.cgi line 31.
Name "main::gmail" used only once: possible typo at ./test.cgi line 31.
{
  'ok' => '1',
  'n' => 1,
  'upserted' => bless( {
                       'value' => '5254f77a1ad417d628000001'
                     }, 'MongoDB::OID' ),
  'connectionId' => 287,
  'err' => undef,
  'updatedExisting' => bless( do{\(my $o = 0)}, 'boolean' )
}

{"status" : "success", "msg" : "handled createDoc request", "result" :  [ {"$oid":"5254f77a1ad417d628000000"}, {"$oid":"5254f77a1ad417d628000001"} ] }



--------------------------------------



{
  'firstName' => 'Bob',
  'pets' => [
            'Cat',
            'Dog',
            'Fish'
          ],
  '_id' => bless( {
                  'value' => '5254f77a1ad417d628000001'
                }, 'MongoDB::OID' ),
  'type' => 'Customer',
  'lastName' => 'Smith'
}



--------------------------------------------------------
