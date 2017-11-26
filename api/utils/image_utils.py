class Base64ToImageConversionException(Exception):
  pass


def base64_to_image(data, file_name):
  try:
    import base64
    from django.core.files.base import ContentFile
    format, img_base64 = data.split(';base64,')
    type = format.split('/')[-1]
    if type != 'jpg' and type != 'png':
      raise Base64ToImageConversionException
    return ContentFile(base64.b64decode(img_base64), name=file_name + '.' + type)
  except Exception as e:
    raise Base64ToImageConversionException
