from flask.views import View
from flask import request, jsonify
from src.errors import InvalidEntityFormat, AccessRoleError
from src.constants.status_codes import (
    UNPROCESSABLE_ENTITY_CODE,
    METHOD_NOT_ALLOWED_CODE,
    FORBIDDEN_CODE
)


class AbstractView(View):
    def __init__(self, concrete_view_factory, middlewares):
        self._concrete_view_factory = concrete_view_factory
        self._middlewares = middlewares

    def dispatch_request(self, *args, **kwargs):
        self._handle_with_middlewares(request)

        handler = self._get_handler(request.method.lower())
        if handler is None:
            return None, METHOD_NOT_ALLOWED_CODE

        try:
            body, status = handler(request, **kwargs)
            return jsonify(
                body or {},
            ), status
        except InvalidEntityFormat as e:
            errors = e.errors or {}
            return jsonify(errors), UNPROCESSABLE_ENTITY_CODE
        except AccessRoleError:
            return jsonify({}), FORBIDDEN_CODE

    def _handle_with_middlewares(self, request):
        for middleware in self._middlewares:
            middleware.handle(request)

    def _get_handler(self, http_method):
        if self._concrete_view_factory is not None:
            view = self._concrete_view_factory.create(http_method)
            return getattr(view, http_method)
        else:
            raise Exception('You must specify a view factory')
