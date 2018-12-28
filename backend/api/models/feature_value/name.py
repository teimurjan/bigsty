from django.db import models

from api.dto.feature_value.name import FeatureValueNameDTO
from api.models.feature_value import FeatureValue
from api.models.intl import IntlText


class FeatureValueName(IntlText):
    value = models.CharField(max_length=100, null=False, blank=False)
    feature_value = models.ForeignKey(FeatureValue, related_name="names",
                                      related_query_name="name", on_delete=models.CASCADE)

    def to_dto(self):
        return FeatureValueNameDTO(
            self.pk,
            self.feature_value.to_dto(names_to_dto=False),
            self.value,
            self.language.to_dto()
        )

    class Meta:
        db_table = 'api_feature_value_name'
