import abc

from django.db import IntegrityError
from django.http import JsonResponse

from api.utils.error_messages import *
from api.utils.response_messages import *
from api.validators import RegistrationFormValidator, LoginFormValidator, ProductFormValidator
from main import settings
from store.models import *


class Serializer:
  GLOBAL_ERR_LABEL = 'global'
  DATA_LABEL = 'data'
  ID_LABEL = 'id'

  def __init__(self, data=None):
    if data:
      self.data = data

  @abc.abstractmethod
  def create(self):
    return

  @abc.abstractmethod
  def read(self):
    return

  @abc.abstractmethod
  def update(self):
    return

  @abc.abstractmethod
  def delete(self):
    return


class UserSerializer(Serializer):
  NAME_FIELD_LABEL = 'name'
  EMAIL_FIELD_LABEL = 'email'
  PASSWORD_FIELD_LABEL = 'password'

  TOKEN_LABEL = 'token'
  GROUP_LABEL = 'group'

  READER_GROUP_NAME = 'reader'

  def register(self):
    name = self.data[self.NAME_FIELD_LABEL]
    email = self.data[self.EMAIL_FIELD_LABEL]
    password = self.data[self.PASSWORD_FIELD_LABEL]
    validator = RegistrationFormValidator(name, email, password)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=411)
    import bcrypt
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    group = Group.objects.get(name=self.READER_GROUP_NAME)
    try:
      user = User.objects.create(name=name,
                                 email=email,
                                 password=hashed_password,
                                 group=group)
      import jwt
      payload = {self.ID_LABEL: user.pk, self.GROUP_LABEL: user.group.name}
      token = jwt.encode(payload, settings.SECRET_KEY).decode()
      return JsonResponse({self.TOKEN_LABEL: token})
    except IntegrityError:
      return JsonResponse({self.EMAIL_FIELD_LABEL: [SAME_EMAIL_ERR]}, status=411)

  def login(self):
    email = self.data[self.EMAIL_FIELD_LABEL]
    password = self.data[self.PASSWORD_FIELD_LABEL]
    validator = LoginFormValidator(email, password)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=411)
    user = User.objects.get(email=email)
    import bcrypt
    is_valid_password = bcrypt.checkpw(password.encode(), user.password.encode())
    if is_valid_password:
      import jwt
      payload = {self.ID_LABEL: user.pk, self.GROUP_LABEL: user.group.name}
      token = jwt.encode(payload, settings.SECRET_KEY).decode()
      return JsonResponse({self.TOKEN_LABEL: token})
    else:
      return JsonResponse({self.PASSWORD_FIELD_LABEL: [PASSWORD_DOESNT_MATCH_ERR]}, status=411)

  def create(self):
    pass

  def read(self):
    pass

  def update(self):
    pass

  def delete(self):
    user_id = self.data[self.ID_LABEL]
    try:
      User.objects.get(pk=user_id).delete()
      return JsonResponse(MESSAGE_OK)
    except User.DoesNotExist:
      return JsonResponse({self.GLOBAL_ERR_LABEL: [NO_SUCH_USER_ERR]}, status=404)


class UserListSerializer(Serializer):
  def delete(self):
    pass

  def create(self):
    pass

  def update(self):
    pass

  def read(self):
    response = {self.DATA_LABEL: []}
    for user in User.objects.all():
      response[self.DATA_LABEL].append(user.to_dict())
    return JsonResponse(response)


class CategoryListSerializer(Serializer):
  NAME_LABEL = 'name'

  def read(self):
    response = {self.DATA_LABEL: []}
    categories = Category.objects.all()
    for category in categories:
      response[self.DATA_LABEL].append({self.ID_LABEL: category.pk, self.NAME_LABEL: category.name})
    return JsonResponse(response)

  def update(self):
    pass

  def create(self):
    pass

  def delete(self):
    pass


class CategorySerializer(Serializer):
  NAME_LABEL = 'name'

  def delete(self):
    pass

  def create(self):
    pass

  def update(self):
    pass

  def read(self):
    category_id = self.data[self.ID_LABEL]
    try:
      category = Category.objects.get(pk=category_id)
      return JsonResponse({self.ID_LABEL: category.pk, self.NAME_LABEL: category.name})
    except Category.DoesNotExist:
      return JsonResponse({self.GLOBAL_ERR_LABEL: [NO_SUCH_CATEGORY_ERR]}, status=411)


class ProductListSerializer(Serializer):
  NAME_FIELD_LABEL = 'name'
  MAIN_IMAGE_FIELD_LABEL = 'main_image'
  PRICE_FIELD_LABEL = 'price'
  CATEGORY_FIELD_LABEL = 'category'

  def delete(self):
    pass

  def create(self):
    name = self.data[self.NAME_FIELD_LABEL]
    main_image = self.data[self.MAIN_IMAGE_FIELD_LABEL]
    price = self.data[self.PRICE_FIELD_LABEL]
    category_id = self.data[self.CATEGORY_FIELD_LABEL]
    validator = ProductFormValidator(name, main_image, price, category_id)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors)
    product = Product.objects.create(
      name=name,
      main_image=main_image,
      price=price,
      category=Category.objects.get(pk=category_id)
    )
    return JsonResponse(product.to_dict())

  def update(self):
    pass

  def read(self):
    response = {self.DATA_LABEL: []}
    products = Product.objects.filter(category_id=self.data[self.ID_LABEL])
    for product in products:
      response[self.DATA_LABEL].append(product.to_dict())
    return JsonResponse(response)


class ProductSerializer(Serializer):
  def delete(self):
    pass

  def create(self):
    pass

  def update(self):
    pass

  def read(self):
    product_id = self.data[self.ID_LABEL]
    try:
      product = Product.objects.get(pk=product_id)
      return JsonResponse(product.to_dict())
    except Product.DoesNotExist:
      return JsonResponse({self.GLOBAL_ERR_LABEL: [NO_SUCH_PRODUCT_ERR]})
