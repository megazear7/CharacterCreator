#!/usr/bin/perl  -wT
use Cwd; $dir=cwd();

use CGI;
use HTTP::Request::Common qw(POST);
use LWP::UserAgent;
use Time::localtime;
use JSON ();
use MongoDB;
use MongoDB::Collection;

# use strict;   #this should really be turned on
use warnings;

# open a connection to the mongodb 
my $conn = new MongoDB::Connection;
my $HackMasterDB   = $conn->get_database( 'hackmaster' ) ;
my $UserCollection = $HackMasterDB->get_collection( 'user' );
my $DocsCollection = $HackMasterDB->get_collection( 'docs' );

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

# grab the cookie from the request and get hash for user document


# setup for output
my $sc  = "";
my $json  = "";


# handle the requests
if ($REQUEST_METHOD eq 'POST') {

    # if cookie doesn't exist, bailout

    if ($h{"request"} eq "saveDoc") {

	my $docid = $h{"docid"};
	
        $json = qq{{"status" : "success", "msg" : "handled saveDoc request"}};
    }

} elsif ($REQUEST_METHOD eq 'GET'){

    if ($h{"request"} eq "login") {
	# handle login request

	my $emailname = $h{"emailname"};
	my $password  = $h{"password"};
	my ($userID);

	# lookup document by username and password
	my $all = $UserCollection->find( { "emailname"=> $emailname } );

	my $dts = $all->next;
	
	$jsonEncoder     = JSON->new->utf8->allow_nonref->allow_blessed->convert_blessed;
        $json = $jsonEncoder->encode($dts) ;

	if ($dts->{password} eq $password)
	{

        	# create a cookie that holds the 
        	# document id of the user record
        	$sc  = $cgi->cookie(
                   -name=>'SessionId', 
                   -value=>$dts->{_id},
	           -expires=>'+1d',
                   #-path=>'/cgi-bin/database',
                   #-domain=>'localhost',
                   #-secure=>1
                   );

	        # create a JSON string according to the database result
        	$json = qq{{"status" : "success", "msg" : "login", "userid" : "$userID", "emailname": "$emailname", "password": "$password", "result": $json }};
	} else

       { 
        	$json = qq{{"status" : "failure", "msg" : "login username or password is wrong", "userid" : "$userID", "emailname": "$emailname", "password": "$password", "result": $json }};
	}



	# also send a list of documents that belong to this user

    } elsif ($h{"request"} eq "register") {
	# handle register request for a new user

	my $emailname = $h{"emailname"};
	my $password  = $h{"password"};
	
	# Check to see if a document exists with this user name an login
	my $all = $UserCollection->find( { "emailname"=> $emailname } );

	my $dts = $all->next;
	
	$jsonEncoder     = JSON->new->utf8->allow_nonref->allow_blessed->convert_blessed;
        $json = $jsonEncoder->encode($dts) ;
        
        
        if ($dts->{password} eq $password) 
        {
        	$json = qq{{"status" : "failure", "msg" : "register", "userid" : $userID, "emailname": $emailname , "password": $password, "result": $json }};
        } else {
        
                # create a cookie that holds the 
        	# document id of the user record
        	$sc  = $cgi->cookie(
                   -name=>'SessionId', 
                   -value=>$dts->{_id},
	           -expires=>'+1d',
                   #-path=>'/cgi-bin/database',
                   #-domain=>'localhost',
                   #-secure=>1
                   );

        	$UserCollection->insert({"emailname"=> $emailname, "password" => $password, "documents" => "" });
        	$json = qq{{"status" : "success", "msg" : "register", "userid" : "$userID", "emailname": "$emailname" , "password": "$password" , "p2": $dts->{password}, "result": $json }};
        }


    } elsif ($h{"request"} eq "userUpdate") {
	# handle request to update user values
	my $emailname = $h{"emailname"};
	my $password  = $h{"password"};

        $json = qq{{"status" : "success", "msg" : "handled userUpdate request"}};
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
