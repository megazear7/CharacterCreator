#!/usr/bin/perl
use strict;
use warnings;

use MongoDB;
use MongoDB::Collection;

use Data::Dumper;

use CGI qw(:standard);
use JSON;


my $conn = new MongoDB::Connection;
my $db   = $conn->get_database( 'test' ) ;
my $coll = $db->get_collection( 'test' );

my $all = $coll->find();
print header('application/json');

my $json_text = to_json($all,{allow_blessed=>1,convert_blessed=>1}) ;
print $json_text;
