import base64
import random
from PIL import Image

class Base64ToImageConversionException(Exception):
    pass


def validate_image(uploaded_image):
    Image.open(uploaded_image).verify()
