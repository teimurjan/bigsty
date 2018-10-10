import base64
import random
from django.core.files.base import ContentFile


class Base64ToImageConversionException(Exception):
    pass


def base64_to_image(data, file_name=random.getrandbits(64)):
    try:
        format_, img_base64 = data.split(';base64,')
        ext = format_.split('/')[-1]
        if ext != 'jpg' and ext != 'png':
            raise Base64ToImageConversionException
        return ContentFile(base64.b64decode(img_base64), name=f'{file_name}.{ext}')
    except Exception as e:
        raise Base64ToImageConversionException
