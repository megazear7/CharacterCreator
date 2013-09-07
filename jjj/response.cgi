#!/usr/bin/env perl

use strict;
use warnings;

use CGI ();
use JSON ();
use Data::Dumper;

my $q     = CGI->new;
print $q->header("application/json");

my $inData = { "firstName" => "James", "lastName" => "Rogers", "type" => "Emperor", "pets" => [ "Floppy hat", "Balloon", "Apple"]};
#my $inData = { "success" => 1};
my $json     = JSON->new->utf8->allow_nonref;
my $jsonData = $json->encode($inData);

print $json->encode($jsonData);

