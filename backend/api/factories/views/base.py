from abc import abstractmethod


class ViewFactory:
    @staticmethod
    @abstractmethod
    def create(http_method=None):
        raise NotImplementedError()
