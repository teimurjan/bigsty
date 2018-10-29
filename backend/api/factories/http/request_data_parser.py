from api.http.request_data_parser import RequestDataParser


class RequestDataParserFactory:
    @staticmethod
    def create(request):
        return RequestDataParser(request)
