#!/usr/bin/perl  -wT
use Cwd; $dir=cwd();

use CGI ;
use HTTP::Request::Common qw(POST);
use LWP::UserAgent;
use Time::localtime;
use JSON ();

#use strict;   #this should really be turned on
use warnings;

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

    }

} elsif ($REQUEST_METHOD eq 'GET'){

    if ($h{"request"} eq "login") {
	# handle login request

	# lookup document by username and password
        my ($userID) = "test";

        # create a cookie that holds the 
        # document id of the user record
        $sc  = $cgi->cookie(
                   -name=>'SessionId', 
                   -value=>'jhwerkwjere',
	           -expires=>'+1d',
                   #-path=>'/cgi-bin/database',
                   #-domain=>'localhost',
                   #-secure=>1
                   );

        # create a JSON string according to the database result
        $json = ($userID) ? 
          qq{{"success" : "login is successful", "userid" : "$userID"}} : 
          qq{{"error" : "username or password is wrong"}};

	# also send a list of documents that belong to this user

    } elsif ($h{"request"} eq "register") {
	# handle register request for a new user

        $json = qq{{"success" : "handled register request"}};
    } elsif ($h{"request"} eq "userUpdate") {
	# handle request to update user values

        $json = qq{{"success" : "handled userUpdate request"}};
    } elsif ($h{"request"} eq "forgotLogin") {
	# if a given user exists, send and email

        $json = qq{{"success" : "handled forgotLogin request"}};
    } elsif ($h{"request"} eq "createDoc") {
	# handle request to update user values

        $json = qq{{"success" : "handled createDoc request"}};
    } elsif ($h{"request"} eq "loadDoc") {
	# handle load document request
        my $inData = { "Quark" => "Spin", "firstName" => "James", "lastName" => "Rogers", "type" => "Emperor", "pets" => [ "Floppyhat", "Balloon", "Apple"]};
#my $inData = { "success" => 1};

        $jsonEncoder     = JSON->new->utf8->allow_nonref;
        $json = $jsonEncoder->encode($inData);

    }

} else {
    # handle unknown method case
    $json = qq{{"error" : "unknown request method", 
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
