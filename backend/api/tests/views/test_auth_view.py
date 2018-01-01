from datetime import datetime, timedelta

import jwt
from django.urls import reverse

from api.models.auth import UserAuthCredentials
from api.tests.views.base.base_view_test import ViewTestCase
from api.utils.http_constants import UNAUTHORIZED_CODE, OK_CODE
from main.settings import SECRET_KEY


class AuthViewTest(ViewTestCase):
  def test_should_post_expired_token(self):
    exp_date = datetime.utcnow() - timedelta(hours=1)
    payload = {'id': self.admin_user.pk, 'name': self.admin_user.name,
               'group': self.admin_user.group.pk, "exp": exp_date}
    token = jwt.encode(payload, SECRET_KEY).decode()
    self.should_get_fail(reverse('users'), expected_code=UNAUTHORIZED_CODE,
                         expected_content={'global': 'Invalid auth credentials'}, token=token)

  def test_should_refresh_token(self):
    auth_cred = UserAuthCredentials.objects.create(user=self.admin_user, client_id=1)
    refresh_token = auth_cred.to_jwt()
    response = self.send_post_request(reverse('refresh'), {'refresh_token': refresh_token})
    self.assertEqual(response.status_code, OK_CODE)

  def test_should_post_invalid_jti(self):
    auth_cred = UserAuthCredentials.objects.create(user=self.admin_user, client_id=1)
    exp_date = datetime.utcnow() + timedelta(days=30)
    from uuid import uuid4
    payload = {'user_id': auth_cred.user.pk, 'client_id': auth_cred.client_id,
               'jti': str(uuid4()), 'exp': exp_date}
    refresh_token = jwt.encode(payload, SECRET_KEY).decode()
    response = self.send_post_request(reverse('refresh'), {'refresh_token': refresh_token})
    self.assertEqual(response.status_code, UNAUTHORIZED_CODE)

  def test_should_post_invalid_client_id(self):
    auth_cred = UserAuthCredentials.objects.create(user=self.admin_user, client_id=1)
    exp_date = datetime.utcnow() + timedelta(days=30)
    payload = {'user_id': auth_cred.user.pk, 'client_id': 2,
               'jti': str(auth_cred.jti), 'exp': exp_date}
    refresh_token = jwt.encode(payload, SECRET_KEY).decode()
    response = self.send_post_request(reverse('refresh'), {'refresh_token': refresh_token})
    self.assertEqual(response.status_code, UNAUTHORIZED_CODE)

  def test_should_post_invalid_user_id(self):
    auth_cred = UserAuthCredentials.objects.create(user=self.admin_user, client_id=1)
    exp_date = datetime.utcnow() + timedelta(days=30)
    payload = {'user_id': 999999, 'client_id': auth_cred.client_id,
               'jti': str(auth_cred.jti), 'exp': exp_date}
    refresh_token = jwt.encode(payload, SECRET_KEY).decode()
    response = self.send_post_request(reverse('refresh'), {'refresh_token': refresh_token})
    self.assertEqual(response.status_code, UNAUTHORIZED_CODE)
