from time import sleep
from neopixel import *

# STRIP SETUP # 
LED_COUNT      = 60      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 5       # DMA channel to use for generating signal (try 5)
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest


#this is the LEAVE NOW light mode


# Main program logic follows:
if __name__ == '__main__':

    #create strip object with setup definitions
    strip = Adafruit_NeoPixel(
        LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS)

    #start up the machine - initialize library
    strip.begin()

    #make every pixel glow in rgb
    red = 255
    green = 0
    blue = 0

    for i in range(9):
        for brghtnss in range(254):
            #strip.setPixelColor(, Color(red, blue, green))
            strip.setBrightness(brghtnss)
            sleep(0.5)
            strip.show()
        sleep(1)
        for brghtnss in range(254):
            strip.setBrightness(255-brghtnss)   
            sleep(0.5)
            strip.show()

    while True:
        for i in range(254):
            strip.setBrightness(i)
            sleep(0.1)
            strip.show()
        sleep(0.5)

        for i in range(254):
            strip.setBrightness(254-i)  
            strip.show()
            sleep(0.1)


