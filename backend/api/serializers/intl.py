from abc import abstractmethod

from api.serializers.base import Serializer


class IntlSerializer(Serializer):
    def __init__(self):
        super().__init__()
        self._language = None

    def in_language(self, language):
        if language:
            self._language = language
        return self

    @abstractmethod
    def serialize(self):
        raise NotImplementedError()
