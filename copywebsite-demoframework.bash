#!/bin/bash

sudo mkdir /var/www/lib
sudo cp lib/* /var/www/lib
sudo mkdir /var/www/demoframework
sudo cp demoframework/test.html /var/www/demoframework/
sudo cp demoframework/json-example.js /var/www/demoframework/
sudo cp demoframework/response.cgi /usr/lib/cgi-bin/

