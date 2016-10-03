#!/bin/bash
# captures three photos when executed

DIR=/var/www/photo

x=1
while [ $x -le 3 ]; do

filename=movement_alert_$(date -u +"%d%m%Y_%H%M-%S").jpg

fswebcam -b -d /dev/video0 -r 1280x720 $DIR/$filename

x=$(( $x + 1 ))

sleep 3;

done;
