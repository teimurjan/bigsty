from django.http import JsonResponse
from django.views import View
from api.errors import InvalidEntityFormat, AccessRoleError
from api.http.status_codes import (
    UNPROCESSABLE_ENTITY_CODE,
    METHOD_NOT_ALLOWED_CODE,
    FORBIDDEN_CODE
)


class AbstractView(View):
    concrete_view_factory = None
    middleware_factories = []
    request_data_parser_factory = None

    def dispatch(self, request, *args, **kwargs):
        if self.request_data_parser_factory:
            request = self.request_data_parser_factory.create(request).parse()
        self._handle_with_middlewares(request)

        handler = self._get_handler(request.method.lower())
        try:
            body, status = handler(request, *args, **kwargs)
            return JsonResponse(
                body or {},
                status=status,
            )
        except InvalidEntityFormat as exc:
            errors = exc.errors or {}
            return JsonResponse(errors, status=UNPROCESSABLE_ENTITY_CODE)
        except AccessRoleError:
            return JsonResponse({}, status=FORBIDDEN_CODE)

    def _handle_with_middlewares(self, request):
        for factory in self.middleware_factories:
            factory.create().handle(request)

    def _get_handler(self, http_method):
        if http_method in self.http_method_names:
            if self.concrete_view_factory is not None:
                view = self.concrete_view_factory.create(http_method)
                return getattr(view, http_method, self.http_method_not_allowed)
            else:
                raise Exception('You must specify a view factory')
        else:
            return self.http_method_not_allowed

    def http_method_not_allowed(self, request, *args, **kwargs):
        return None, METHOD_NOT_ALLOWED_CODE
