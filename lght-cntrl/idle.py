from time import sleep
from neopixel import *

# STRIP SETUP # 
LED_COUNT      = 60      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 5       # DMA channel to use for generating signal (try 5)
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest


#This is the idle light mode"


# Main program logic follows:
if __name__ == '__main__':

	#create strip object with setup definitions
	strip = Adafruit_NeoPixel(
        LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS)

	#start up the machine - initialize library
	strip.begin()

	#make every pixel glow in rgb
	red = 252
	green = 238
	blue = 197

	for i in range(0, strip.numPixels(), 1):
        strip.setPixelColor(i, Color(red, blue, green))
        strip.show()
    #glow light
