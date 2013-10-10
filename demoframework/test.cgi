#!/usr/bin/perl  -wT

use Time::localtime;
use JSON;
use MongoDB;
use MongoDB::Collection;
use MongoDB::OID;
use MongoDB::BSON;
use Digest::SHA3 qw(sha3_224 sha3_224_base64);

use Data::Dumper;
local $Data::Dumper::Terse = 1;

my $salt = "1c59f690-2cbf-11e3-9529-b3c242e7178e";

# open a connection to the mongodb 
my $conn = new MongoDB::Connection;
my $db   = $conn->get_database( 'hackmaster' ) ;
my $UserCollection = $db->get_collection( 'user' );
my $DocCollection;

# setup for output
my $sc  = "";
my $json  = "";

my $jsonEncoder = JSON->new->utf8->allow_nonref->allow_blessed->convert_blessed;


my $userid = "52533e6af04c3c073c000000";
#my $docid  = "5254f77a1ad417d628000002";
my $docid  = "0";
my $emailname = "w\@gmail.com";
my $password  = "p";
	    
#my $str = Dumper($postdata);
#my $jsonData = $jsonEncoder->decode( qq{{$newstr}} );

my $jsonData = {
  "firstName" => "Bob",
  "lastName" => "Smith",
  "type" => "Customer",
  "pets" => [
    "Cat",
    "Dog",
    "Fish"
  ]
};
	    
$DocCollection = $db->get_collection( "a" . $userid );
   
# check error value
    	    my $tmp;
	    my $id;
	    
	    if ($docid eq "0"){
		$id = $DocCollection->insert( $jsonData );
		$docid = $id->to_string;
		$json = qq{{"status" : "success", "msg" : "handled saveDoc request", "docid" : "$docid"}};
	    } else {
	    	$id = $DocCollection->update( 
		    { _id => MongoDB::OID->new(value => $docid)}, 
		    { '$set' => $jsonData }, { 'upsert' => "1"} );
		if ($id->{ok} == 1) {  
		    if ($id->{updatedExisting} != 1) {
			$docid = $id->{upserted}->to_string;
		    };      	
		    $json = qq{{"status" : "success", "msg" : "handled saveDoc request", "docid" : "$docid"}};
	        } else {
		    $json = qq{{"status" : "failure", "msg" : "saveDoc request failed: $id->{err}"}};
	        }
	    }

print $json;

print "\n";
print "------------------------------------------------\n\n";

	
	my $all = $DocCollection->find();
	
	my $retString = " [ ";
	my $firstThruLoop = 1;
	my $doc;
	while ($doc = $all->next) {
		if ($firstThruLoop != 1){ $retString .= ", "; }
        	$retString .= "\"" . $doc->{_id}->to_string . "\"";
    		$firstThruLoop = 0;
    	}

    	$retString .= " ]";
	
        $json = qq{{"status" : "success", "msg" : "handled createDoc request", "result" : $retString }};

print $json;

print "\n";
print "\n";
