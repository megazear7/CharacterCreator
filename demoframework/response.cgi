#!/usr/bin/perl  -wT
use Cwd; $dir=cwd();

use CGI;
use CGI::Cookie;
use HTTP::Request::Common qw(POST);
use LWP::UserAgent;
use Time::localtime;
use JSON ();
use MongoDB;
use MongoDB::Collection;
use MongoDB::OID;
use Digest::SHA3 qw(sha3_224 sha3_224_base64);

# use strict;   #this should really be turned on
use warnings;

# this is used to make the crypto hashes more secure
# a unique salt like this can be updated on a regular
# basis to doubly protect the user credentials.
my $salt = "1c59f690-2cbf-11e3-9529-b3c242e7178e";

# read the CGI params
$cgi 	= new CGI ;
@names 	= $cgi->param ;

$REQUEST_METHOD = $ENV{"REQUEST_METHOD"};
$QUERY_STRING   = $ENV{"QUERY_STRING"};
$keywords       = $cgi->param('keywords');

# create a hash of the query string 
@p = split (/\&/, $QUERY_STRING);
%h = ();
foreach (@p) {
    @nv = split (/=/);  
    $h{$nv[0]} = $nv[1];
}
#foreach (keys(%h)) { print $_ . " : " . $h{$_} . "\n"; }

# grab the cookie from the request compare to userid and document hash
my $Cookie = $cgi->cookie('SessionId');
my $digest = sha3_224_base64( $h{"userid"} . $ENV{"REMOTE_ADDR"} . $salt );
my $validCookie = 0; 
if ($Cookie eq $digest) {$validCookie = 1;};

# open a connection to the mongodb 
my $conn = new MongoDB::Connection;
my $HackMasterDB   = $conn->get_database( $h{"database"} ) ;
my $UserCollection = $HackMasterDB->get_collection( 'user' );
my $DocsCollection = $HackMasterDB->get_collection( 'docs' );


# setup for output
my $sc  = "";
my $json  = "";


# handle the requests
if ($REQUEST_METHOD eq 'POST') {

    # if cookie doesn't exist, bailout

    if ($h{"request"} eq "saveDoc") {

	my $userid = $h{"userid"};
	
        $json = qq{{"status" : "success", "msg" : "handled saveDoc request", "validCookie" : "$validCookie", "Cookie" : "$Cookie", "Digest" : "$digest"}};
    }

} elsif ($REQUEST_METHOD eq 'GET'){

    if ($h{"request"} eq "login") {
	# handle login request

	my $emailname = $h{"emailname"};
	my $password  = $h{"password"};
	my ($userid);

	# lookup document by username and password
	my $all = $UserCollection->find( { "emailname"=> $emailname } );

	my $dts = $all->next;
	
	$jsonEncoder     = JSON->new->utf8->allow_nonref->allow_blessed->convert_blessed;
        $json = $jsonEncoder->encode($dts) ;

	if ($dts->{password} eq $password)
	{

        	# create a cookie that holds the 
        	# document id of the user record
        	$value = sha3_224_base64( $dts->{_id} . $ENV{"REMOTE_ADDR"} . $salt );
	       	#$value = $dts->{_id};
	       	#$value = "bob";
        	$sc  = $cgi->cookie(
                   -name=>'SessionId', 
                   -value=>$value,
	           -expires=>'+1d',
                   #-path=>'/cgi-bin/database',
                   #-domain=>'localhost',
                   #-secure=>1
                   );

	        # create a JSON string according to the database result
        	$json = qq{{"status" : "success", "msg" : "Login was successful.", "result": $json }};
	} else { 
        	$json = qq{{"status" : "failure", "msg" : "Login username or password is wrong", "result": $json }};
	}



	# also send a list of documents that belong to this user

    } elsif ($h{"request"} eq "register") {
	# handle register request for a new user

	my $emailname = $h{"emailname"};
	my $password  = $h{"password"};
	my $screenName  = $h{"screenName"};
	
	# Check to see if a document exists with this user name an login
	my $all = $UserCollection->find( { "emailname"=> $emailname } );

	my $dts = $all->next;
	
	$jsonEncoder     = JSON->new->utf8->allow_nonref->allow_blessed->convert_blessed;
        $json = $jsonEncoder->encode($dts) ;
        
        
        if ($dts->{emailname} eq $emailname) 
        {
        	# if this user exists, then you cant register with the same email address
        	# Issue: this will possibly leak who has an account on the site.
        	$json = qq{{"status" : "failure", "msg" : "Registration failed, duplicate email address."}};
        } else {

		# do we need to check the error return for a valid response?
        	$UserCollection->insert({"emailname"=> $emailname, "password" => $password, 
        		"screenName" => $screenName, "documents" => "" });
        	$json = qq{{"status" : "success", "msg" : "Registered new user.", "result": $json }};
        }


    } elsif ($h{"request"} eq "userUpdate") {
	# handle request to update user values
	my $emailname  = $h{"emailname"};
	my $password   = $h{"password"}; 
	my $screenName = $h{"screenName"};
	my $userid     = $h{"userid"};

	if ($validCookie == 1)
	{
		#my $all = $UserCollection->update( { "emailname"=> $emailname } );
		#$UserCollection->update( { emailname => $emailname }, 
		#	{ '$set' => { screenName => $screenName } } );
		
		# find({ _id => MongoDB::OID->new(value => "4d2a0fae9e0a3b4b32f70000")})
		$UserCollection->update( 
			{ _id => MongoDB::OID->new(value => $userid)}, 
			{ '$set' => { screenName => $screenName,
				password => $password } } );
		

		$json = qq{{"status" : "success", "msg" : "handled userUpdate request"}};
		# "cookie" : $Cookie, "digest" : $digest, "userid" : $h{"userid"}, "found" : $found,
		 
	} else {
		$json = qq{{"status" : "failure", 
		"cookie" : $Cookie, "digest" : $digest, "userid" : $h{"userid"}, "found" : $found,
		"msg" : "Invalid credentials."}};

	}

    } elsif ($h{"request"} eq "forgotLogin") {
	# if a given user exists, send and email
	my $emailname = $h{"emailname"};

        $json = qq{{"status" : "success", "msg" : "handled forgotLogin request"}};
    } elsif ($h{"request"} eq "createDoc") {
	# handle request to update user values
	
        $json = qq{{"status" : "success", "msg" : "handled createDoc request"}};
    } elsif ($h{"request"} eq "loadDoc") {
	# handle load document request
        # my $inData = { "Quark" => "Spin", "firstName" => "James", "lastName" => "Rogers", "type" => "Emperor", "pets" => [ "Floppyhat", "Balloon", "Apple"]};
#my $inData = { "success" => 1};
	my $userid = $h{"userid"};
	my $docid = $h{"docid"};

        $jsonEncoder     = JSON->new->utf8->allow_nonref;
        $json = $jsonEncoder->encode($inData);
    }

} else {
    # handle unknown method case
    $json = qq{{"status" : "failure", "msg" : "unknown request method", 
        "REQUEST_METHOD" : $REQUEST_METHOD}};
}

# print out header with cookies
if ($sc ne ""){
print $cgi->header(
    -type    => "application/json", 
    -charset => "utf-8",
    -cookie  => $sc);
} else {
print $cgi->header(
    -type    => "application/json", 
    );
}

#print out the reply string if one exists
print $json;
