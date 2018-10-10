from abc import abstractmethod


class Serializer:
    def __init__(self):
        self._only_fields = None

    def only(self, only_fields):
        if only_fields:
            self._only_fields = only_fields
        return self

    def _filter_with_only_fields(self, serialized_dict):
        if self._only_fields:
            filtered_dict = {}
            for field in serialized_dict.keys():
                if field in self._only_fields:
                    filtered_dict[field] = serialized_dict[field]
            return filtered_dict
        else:
            return serialized_dict

    @abstractmethod
    def serialize(self):
        raise NotImplementedError()
