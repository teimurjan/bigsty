import bcrypt


def encrypt(password):
  return bcrypt.hashpw(password.encode(), bcrypt.gensalt())


def matches(password_to_check, user_password):
  return bcrypt.checkpw(password_to_check.encode(), user_password.encode())
