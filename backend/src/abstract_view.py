from flask.views import View
from flask import request, jsonify
from src.errors import InvalidEntityFormat, AccessRoleError
from src.constants.status_codes import (
    UNPROCESSABLE_ENTITY_CODE,
    METHOD_NOT_ALLOWED_CODE,
    FORBIDDEN_CODE
)


class AbstractView(View):
    concrete_view_factory = None
    middleware_factories = []

    def dispatch_request(self):
        self._handle_with_middlewares(request)

        handler = self._get_handler(request.method.lower())
        try:
            body, status = handler(request)
            return jsonify(
                body or {},
            ), status
        except InvalidEntityFormat as exc:
            errors = exc.errors or {}
            return jsonify(errors), UNPROCESSABLE_ENTITY_CODE
        except AccessRoleError:
            return jsonify({}), FORBIDDEN_CODE

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
            return None, METHOD_NOT_ALLOWED_CODE
