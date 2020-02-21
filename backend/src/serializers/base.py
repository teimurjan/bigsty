from abc import abstractmethod

from sqlalchemy.orm.exc import DetachedInstanceError


class Serializer:
    def __init__(self):
        self._only_fields = None

    def _init_relation_safely(self, attr_name, obj, relation_name):
        try:
            setattr(self, attr_name, getattr(obj, relation_name))
        except DetachedInstanceError:
            setattr(self, attr_name, None)

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
        return serialized_dict

    def _with_serialized_relation(self, attr_name, model_cls, serializer_cls, before_serialize=None):
        if isinstance(getattr(self, attr_name), model_cls):
            serializer = serializer_cls(getattr(self, attr_name))

            if before_serialize is not None and callable(before_serialize):
                before_serialize(serializer)

            setattr(
                self,
                attr_name,
                serializer.serialize()
            )
        return self

    def _serialize_relation(self, attr_name, model_cls):
        if isinstance(getattr(self, attr_name), model_cls):
            return getattr(self, attr_name).id
        return getattr(self, attr_name)

    def _with_serialized_relations(self, attr_name, model_cls, serializer_cls, before_serialize=None):
        serialized = []
        for i in getattr(self, attr_name):
            serializer = serializer_cls(i)

            if before_serialize is not None and callable(before_serialize):
                before_serialize(serializer)

            serialized.append(serializer.serialize())

        setattr(self, attr_name, serialized)
        return self

    def _serialize_relations(self, attr_name, model_cls):
        if getattr(self, attr_name) and isinstance(getattr(self, attr_name)[0], model_cls):
            return [i.id for i in getattr(self, attr_name)]
        return getattr(self, attr_name)

    @abstractmethod
    def serialize(self):
        raise NotImplementedError()
