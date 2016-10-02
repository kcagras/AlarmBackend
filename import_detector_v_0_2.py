#!/usr/bin/env python
import RPi.GPIO as GPIO
import time
import tkMessageBox
import subprocess
import sys

SENSOR_PIN=23

GPIO.setmode(GPIO.BCM)
GPIO.setup(SENSOR_PIN, GPIO.IN)



def mein_callback(channel):

 #Optionaler Befehl, der bei Bewegung ausgeloest wird
        print('Move detected')
        subprocess.Popen(['python','/home/pi/mail_alarm.py'])
        print u"1"
        sysout.stdout.flush()
        #tkMessageBox.showinfo('bla')
        
try:
	GPIO.add_event_detect(SENSOR_PIN, 
GPIO.RISING, callback=mein_callback)
	while True:
		time.sleep(100)
except KeyboardInterrupt:
	print "Exit..."
GPIO.cleanup()
