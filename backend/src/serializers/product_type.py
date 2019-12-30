from src.models.category import Category
from src.models.feature_type import FeatureType
from src.serializers.intl import IntlSerializer
from src.serializers.feature_type import FeatureTypeSerializer
from src.serializers.category import CategorySerializer


class ProductTypeSerializer(IntlSerializer):
    def __init__(self, product_type):
        super().__init__()
        self._id = product_type.id
        self._names = product_type.names
        self._descriptions = product_type.descriptions
        self._short_descriptions = product_type.short_descriptions
        self._image = product_type.image
        self._category = product_type.category
        self._feature_types = product_type.feature_types

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'name': self._serialize_name(),
            'description': self._serialize_description(),
            'short_description': self._serialize_short_description(),
            'image': self._image,
            'category': self._serialize_category(),
            'feature_types': self._serialize_feature_types(),
        })

    def _serialize_name(self):
        return self._get_intl_field_from(self._names)

    def _serialize_description(self):
        return self._get_intl_field_from(self._descriptions)

    def _serialize_short_description(self):
        return self._get_intl_field_from(self._short_descriptions)

    def with_serialized_category(self):
        if isinstance(self._category, Category):
            self._category = (
                CategorySerializer(self._category)
                .in_language(self._language)
                .serialize()
            )
        return self

    def _serialize_category(self):
        return self._category.id if isinstance(self._category, Category) else self._category

    def with_serialized_feature_types(self):
        self._feature_types = [
            FeatureTypeSerializer(feature_type)
            .in_language(self._language)
            .serialize()
            for feature_type in self._feature_types
        ]
        return self

    def _serialize_feature_types(self):
        if len(self._feature_types) > 0 and isinstance(self._feature_types[0], FeatureType):
            return [feature_type.id for feature_type in self._feature_types]
        else:
            return self._feature_types
