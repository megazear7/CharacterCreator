#!/bin/bash

sudo cp -r demoframework /var/www/
sudo cp characterClient/response.cgi /usr/lib/cgi-bin/
sudo cp -r characterClient /var/www/
sudo cp -r lib /var/www/

# on alex's computer the apache directories are as follows:
# /var/www/                       for html files
# /usr/lib/cgi-bin/   		      for cgi files
# /var/log/apache2/error.log      for error log
# /var/log/apache2/access.log     for access log
