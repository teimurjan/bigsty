import json

from django.http import HttpResponseBadRequest, JsonResponse
from django.views import View

from api.utils.errors import InvalidEntityFormat
from api.utils.http import UNPROCESSABLE_ENTITY_CODE, METHOD_NOT_ALLOWED_CODE


class ViewWrapper(View):
    view_factory = None
    middleware_factories = []

    def dispatch(self, request, *args, **kwargs):
        response = self._check_middlewares(request)
        if response:
            return response

        handler = self._get_handler(request.method.lower())
        try:
            if request.body:
                request.data = json.loads(request.body.decode())
            else:
                request.data = {}
            body, status = handler(request, *args, **kwargs)
            return JsonResponse(
                body if body else {},
                status=status,
                content_type='application/json'
            )
        except json.JSONDecodeError:
            return HttpResponseBadRequest()
        except InvalidEntityFormat as exception:
            return JsonResponse(exception.errors or {}, status=UNPROCESSABLE_ENTITY_CODE)

    def _check_middlewares(self, request):
        for factory in self.middleware_factories:
            return factory.create().handle(request)

    def _get_handler(self, http_method):
        if http_method in self.http_method_names:
            if self.view_factory is not None:
                view = self.view_factory.create(http_method)
                return getattr(view, http_method, self.http_method_not_allowed)
            else:
                raise Exception('You must specify a view factory')
        else:
            return self.http_method_not_allowed

    def http_method_not_allowed(self, request, *args, **kwargs):
        return None, METHOD_NOT_ALLOWED_CODE
