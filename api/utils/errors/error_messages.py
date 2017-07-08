def get_not_exist_msg(model):
  return '%s does not exist' % model.__name__


def get_field_empty_msg(field_name):
  return '%s field cannot be empty' % field_name.capitalize()
