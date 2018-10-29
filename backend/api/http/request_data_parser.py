import json
from io import BytesIO
from django.http.multipartparser import MultiPartParserError
from django.http import QueryDict
from django.utils.datastructures import MultiValueDict


class RequestDataParser:
    def __init__(self, request):
        self._request = request

    def parse(self):
        if self._request.content_type == 'application/json':
            self._handle_json_request()
        elif self._request.content_type == 'multipart/form-data':
            self._handle_multipart_request()
        return self._request

    def _handle_json_request(self):
        try:
            self._request.data = json.loads(
                self._request.body.decode()
            ) if self._request.body else {}
        except json.JSONDecodeError:
            self._request.data = {}

    def _handle_multipart_request(self):
        if self._request.method == 'POST':
            self._request.form_data, self._request.files = self._request.POST, self._request.FILES
            self._request.POST = QueryDict(mutable=True)
            self._request._files = MultiValueDict()
            return

        if self._request._read_started and not hasattr(self._request, '_body'):
            self._request._mark_post_parse_error()
            return

        if hasattr(self._request, '_body'):
            data = BytesIO(self._request._body)
        else:
            data = self._request
        try:
            self._request.form_data, self._request.files = self._request.parse_file_upload(
                self._request.META,
                data
            )
        except MultiPartParserError:
            # An error occurred while parsing POST data. Since when
            # formatting the error the request handler might access
            # self.POST, set self._post and self._file to prevent
            # attempts to parse POST data again.
            # Mark that an error occurred. This allows self.__repr__ to
            # be explicit about it instead of simply representing an
            # empty POST
            self._request._mark_post_parse_error()
            raise
