from django.test import TestCase

from api.models import User
from api.serializers import generate_token


class ProductTypeListViewTest(TestCase):
  fixtures = ['product_type_list_view_test.json']

  def setUp(self):
    user = User.objects.get(pk=2)
    self.token = generate_token(user)