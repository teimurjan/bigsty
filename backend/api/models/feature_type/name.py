from django.db import models

from api.dto.feature_type.name import FeatureTypeNameDTO
from api.models.feature_type import FeatureType
from api.models.intl import IntlText


class FeatureTypeName(IntlText):
    value = models.CharField(max_length=100, null=False, blank=False)
    feature_type = models.ForeignKey(FeatureType, related_name="names",
                              related_query_name="name", on_delete=models.CASCADE)

    def to_dto(self):
        return FeatureTypeNameDTO(
            self.pk, 
            self.feature_type.to_dto(names_to_dto=False), 
            self.value, 
            self.language.to_dto()
        )

    class Meta:
        db_table = 'api_feature_type_name'
