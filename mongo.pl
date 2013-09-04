#!/usr/bin/perl -w
 
use strict;
use warnings;
 
use MongoDB;
use MongoDB::OID;
use Data::Dumper;
 
# TODO. I have to make some check loops testing for failing connections etc.
 
# Connection
my $connection = MongoDB::Connection->new ();
#$connection->authenticate ('database_name', 'user', 'password');
 
# Database
my $db = $connection->get_database( 'test' );
 
# Collection
my $collection = $db->get_collection ('test');
 
# find one entry
my $entry = $collection->findOne();
print $entry;


# Query
my $result = $collection->find();
 
#print "Content-type: text/plain\n\n";
while (my $doc = $result->next()) {
  print Dumper $doc ;
}
