import jwt
from django.http import HttpRequest, JsonResponse
from django.utils.deprecation import MiddlewareMixin
from jwt import InvalidTokenError

from api.models import User
from api.utils.form_fields import ID_FIELD
from api.utils.http_constants import AUTHORIZATION_HEADER
from api.utils.json_responses import JsonResponseUnauthorized, JsonResponseForbidden
from main import settings


class AuthMiddleware(MiddlewareMixin):
  def process_view(self, request, view_func, view_args, view_kwargs) -> JsonResponse:
    auth_rules = view_func.view_class.auth_rules
    if not auth_rules or len(auth_rules) == 0: return view_func(request, *view_args, **view_kwargs)
    allowed_roles = auth_rules.get(request.method) or []
    if 'anonymous' in allowed_roles: return view_func(request, *view_args, **view_kwargs)
    try:
      token = request.META[AUTHORIZATION_HEADER].replace('Bearer ', '')
      decoded_token = jwt.decode(token, settings.SECRET_KEY)
      user = User.objects.get(pk=decoded_token[ID_FIELD])
      if not user.is_active:
        return JsonResponseUnauthorized()
      if user.group.name not in allowed_roles:
        return JsonResponseForbidden()
      request.user = user
    except (InvalidTokenError, KeyError, User.DoesNotExist) as e:
      return JsonResponseUnauthorized()
