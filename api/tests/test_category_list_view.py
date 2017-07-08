import json

from django.test import TestCase

from api.models import Category, FeatureType
from api.tests.constants import CATEGORY_LIST_URL
from api.utils.form_fields_constants import DATA_KEY
from api.utils.response_constants import OK_CODE


class CategoryListViewTest(TestCase):
  fixtures = ['category_list_view_test.json']

  def test_should_get_success(self):
    response = self.client.get(CATEGORY_LIST_URL)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())
    categories = data[DATA_KEY]
    categories_in_db = Category.objects.all()
    self.assertEquals(categories[1], categories_in_db[1].to_dict())
    self.assertEquals(len(categories), len(categories_in_db))

  def instance_dict(instance, key_format=None):
    from django.core import serializers
    return serializers.serialize("json", instance)
