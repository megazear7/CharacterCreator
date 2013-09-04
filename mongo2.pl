#!/usr/bin/perl
use strict;
use warnings;

use MongoDB;
use MongoDB::Collection;

use Data::Dumper;

my $conn = new MongoDB::Connection;
my $db   = $conn->get_database( 'test' ) ;
my $coll = $db->get_collection( 'test' );

my $all = $coll->find();
my $dts = $all->next;
print Dumper $dts;

my @a = keys %$dts;

my $str = '{ "' .
    $a[0] . '": ' .
    $dts->{a} . ', "' .
    $a[1] .  '": "' .
    $dts->{_id} . '"' .
    " }\n";

print  "\n";
print "The JSON version: \n";
print $str;
