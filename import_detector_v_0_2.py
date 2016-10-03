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
	file = open('/home/pi/AlarmBackend/status.txt', 'r')
	status = file.readline()
	file.close()
	print('Callback called, current status:', status)
	
	if status == 'start':
		#Optionaler Befehl, der bei Bewegung ausgeloest wird
		print('Move detected')
		subprocess.Popen(['python','/home/pi/mail_alarm.py'])
		subprocess.Popen(['bash', '/home/pi/AlarmBackend/photocapture1.sh'])
		print u"1"
	else:
		print('Doing Nothing because status != start')
	sysout.stdout.flush()
	time.sleep(5000)
	#tkMessageBox.showinfo('bla')
        
try:
	GPIO.add_event_detect(SENSOR_PIN, 
GPIO.RISING, callback=mein_callback)
	while True:
		time.sleep(100)
except KeyboardInterrupt:
	print "Exit..."
GPIO.cleanup()
