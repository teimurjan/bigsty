from django.views.generic import View

from api.serializers import *
import json

from api.validators import *


class LoginView(View):
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    validator = LoginFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=411)
    serializer = AuthSerializer(data)
    return serializer.login()


class RegistrationView(View):
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    validator = RegistrationFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=411)
    serializer = AuthSerializer(data)
    return serializer.register()


class UserListView(View):
  def get(self, request):
    serializer = UserListSerializer()
    return serializer.read()


class UserView(View):
  def delete(self, request, user_id):
    serializer = UserSerializer({'id': user_id})
    return serializer.delete()


class CategoryListView(View):
  def get(self, request):
    serializer = CategoryListSerializer()
    return serializer.read()


class CategoryView(View):
  def get(self, request, category_id):
    serializer = CategorySerializer({'id': category_id})
    return serializer.read()


class ProductListView(View):
  def get(self, request, category_id=None):
    serializer = ProductListSerializer({'id': category_id})
    return serializer.read()

  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    data = {
      'name': data['name'],
      'description': data['description'],
      'price': data['price'],
      'category': data['category'],
      'image': data['image'],
      'discount': data['discount'],
      'quantity': data['quantity']
    }
    validator = ProductFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=411)
    serializer = ProductListSerializer(data)
    return serializer.create()


class ProductView(View):
  def get(self, request, product_id):
    serializer = ProductSerializer({'id': product_id})
    return serializer.read()
