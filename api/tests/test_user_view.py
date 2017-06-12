from django.test import TestCase

from api.models import User
from api.serializers import generate_token
from api.tests.constants import USER_LIST_URL
from api.utils.response_constants import OK_CODE, FORBIDDEN_CODE


def url(user_id):
  return '%s/%s' % (USER_LIST_URL, user_id)


class UserViewTest(TestCase):
  fixtures = ["user_view_test.json"]

  def setUp(self):
    user = User.objects.get(pk=2)
    self.token = generate_token(user)

  def test_delete_success(self):
    user_to_delete_pk = 1
    response = self.client.delete(url(user_to_delete_pk), HTTP_AUTHORIZATION='Bearer %s' % self.token)
    self.assertEquals(response.status_code, OK_CODE)
    users = User.objects.all()
    self.assertEquals(len(users), 2)
    with self.assertRaises(User.DoesNotExist):
      User.objects.get(pk=user_to_delete_pk)

  def test_delete_admin_required(self):
    user_to_delete_pk = 1
    response = self.client.delete(url(user_to_delete_pk), HTTP_AUTHORIZATION='invalid')
    self.assertEquals(response.status_code, FORBIDDEN_CODE)
    users = User.objects.all()
    self.assertEquals(len(users), 3)
