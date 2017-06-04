from django.views.generic import View

from api.serializers import *
import json


class LoginView(View):
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    serializer = UserSerializer(data)
    return serializer.login()


class RegisterView(View):
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    serializer = UserSerializer(data)
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
  def get(self, request, category_id):
    serializer = ProductListSerializer({'id': category_id})
    return serializer.read()

  def post(self, request):
    payload = request.POST
    files = request.FILES
    data = {
      'name': payload['name'],
      'price': payload['price'],
      'category': payload['category'],
      'main_image': files['main_image']
    }
    serializer = ProductListSerializer(data)
    return serializer.create()


class ProductView(View):
  def get(self, request, product_id):
    serializer = ProductSerializer({'id': product_id})
    return serializer.read()
