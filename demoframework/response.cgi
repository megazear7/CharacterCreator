#!/usr/bin/perl  -wT

our %in;
use CGI qw(:cgi-lib :standard);
CGI::ReadParse;
$CGI::POST_MAX=1024 * 100;  # max 100K posts
$CGI::DISABLE_UPLOADS = 1;  # no uploads

use CGI::Carp 'fatalsToBrowser';

use CGI::Cookie;
use HTTP::Request::Common qw(POST);
use LWP::UserAgent;

use Time::localtime;
use JSON;
use MongoDB;
use MongoDB::Collection;
use MongoDB::OID;
use MongoDB::BSON;
use Digest::SHA3 qw(sha3_224 sha3_224_base64);

use BSON qw/encode decode/;

use Data::Dumper;
local $Data::Dumper::Terse = 1;

use strict;   #this should really be turned on
use warnings;

# this is used to make the crypto hashes more secure
# a unique salt like this can be updated on a regular
# basis to doubly protect the user credentials.
my $salt = "1c59f690-2cbf-11e3-9529-b3c242e7178e";

# read the CGI params
my $cgi 	= new CGI ;

my @names 	= $cgi->param ;

my $REQUEST_METHOD = $ENV{"REQUEST_METHOD"};
my $QUERY_STRING   = $ENV{"QUERY_STRING"};
my $keywords       = $cgi->param('keywords');

# create a hash of the query string 
my @p = split (/\&/, $QUERY_STRING);
my %h = ();
my @nv;
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
my $db   = $conn->get_database( $h{"database"} ) ;
my $UserCollection = $db->get_collection( 'user' );
my $DocCollection;

# setup for output
my $sc  = "";
my $json  = "";

my $jsonEncoder = JSON->new->utf8->allow_nonref->allow_blessed->convert_blessed;

# handle the requests
if ($REQUEST_METHOD eq 'POST') {

    # if cookie doesn't exist, bailout

    if ($h{"request"} eq "saveDoc") {

	if ($validCookie == 1)
	{
	    my $userid = $h{"userid"};
	    my $docid = $h{"docid"};
	    
	    my $postdata = $in{keywords};
	    
	    my $str = Dumper($postdata);
	    
	    chomp($str);
	    chomp($str);
	     $/ = "'";
	     
	    chomp($str);
	    $str = substr($str, 1);
	    
	    my $newstr = $str;
	    $newstr = substr($newstr, 1, length($newstr)-2);
            
	    my $jsonData = $jsonEncoder->decode( qq{{$newstr}} );
	    
	    my $UserCollection = $db->get_collection( "a" . $userid );
	    
	    # check error value
	    
	    if ($docid eq "0") { 
	    
	    	# insert
	        my $id = $DocCollection->insert( $jsonData );
	        
	        # check error value
		
		my $tmp = Dumper($id);
		
		$docid = substr($tmp, 30, 24);
	        
	    } else {
	    
	    	# update
	    	$UserCollection->update( 
			{ _id => MongoDB::OID->new(value => $docid)}, 
			{ '$set' => $jsonData } );
				
		# check error value
	    }
			
            $json = qq{{"status" : "success", "msg" : "handled saveDoc request", "docid" : "$docid"}};
            
        } else {
		$json = qq{{"status" : "failure", "msg" : "Invalid credentials."}};
	}
    }

} elsif ($REQUEST_METHOD eq 'GET'){

    if ($h{"request"} eq "login") {
	# handle login request

	my $emailname = $h{"emailname"};
	my $password  = $h{"password"};
	my $userid;

	# lookup document by username and password
	my $all = $UserCollection->find( { "emailname"=> $emailname } );

	my $dts = $all->next;
	
        $json = $jsonEncoder->encode($dts) ;

	if ($dts->{password} eq $password)
	{
        	# create a cookie that holds the 
        	# document id of the user record
        	my $value = sha3_224_base64( $dts->{_id} . $ENV{"REMOTE_ADDR"} . $salt );

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

	my $emailname  = $h{"emailname"};
	my $password   = $h{"password"};
	my $screenName = $h{"screenName"};
	
	# Check to see if a document exists with this user name an login
	my $all = $UserCollection->find( { "emailname"=> $emailname } );
	my $dts = $all->next;
        $json = $jsonEncoder->encode($dts);
        
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
		$UserCollection->update( 
			{ _id => MongoDB::OID->new(value => $userid)}, 
			{ '$set' => { screenName => $screenName,
				password => $password } } );

		$json = qq{{"status" : "success", "msg" : "handled userUpdate request"}};
		 
	} else {
		$json = qq{{"status" : "failure", "msg" : "Invalid credentials."}};
	}

    } elsif ($h{"request"} eq "forgotLogin") {
	# if a given user exists, send and email
	my $emailname = $h{"emailname"};

        $json = qq{{"status" : "success", "msg" : "handled forgotLogin request"}};
    } elsif ($h{"request"} eq "loadDocList") {
	# handle request to update user values
	
	my $userid = $h{"userid"};
	    
	my $DocCollection = $db->get_collection( "a" . $userid );
	
	my $all = $DocCollection->find();
	
	my $retString = "{\"results\":[";
	while (my $doc = $all->next) {
        	#print $doc->{'name'}."\n";
        	my $jsonDoc = $jsonEncoder->encode($doc);
        	$retString .= "$jsonDoc, ";
    	}
    	$retString .= "]}";
	
        $json = qq{{"status" : "success", "msg" : "handled createDoc request", "result" : $retString }};
    } elsif ($h{"request"} eq "loadDoc") {
	# handle load document request

	if ($validCookie == 1)
	{
	    my $userid = $h{"userid"};
	    my $docid  = $h{"docid"};
	    
	    my $DocCollection = $db->get_collection( "a" . $userid );
	
	    my $all = $DocCollection->find( { _id=> MongoDB::OID->new(value => $docid) } );
	    
	    #my $err = $db->last_error();
	    
	    my $dts = $all->next;
	
            my $jsonDoc = $jsonEncoder->encode($dts);

	    $json = qq{{"status" : "success", "msg" : "handled saveDoc request", "results": $jsonDoc }};
	    
	    # trying to implement some error handling.
            if ($jsonDoc eq '') {	    
            } else {
	        #$json = qq{{"status" : "failure", "msg" : "Document Not Found"}};
	    }
            
        } else {
	    $json = qq{{"status" : "failure", "msg" : "Invalid credentials"}};
	}
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
    -cookie  => $sc
    );
} else {
print $cgi->header(
    -type    => "application/json", 
    );
}

#print out the reply string if one exists
print $json;
