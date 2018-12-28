from django.db import models
from django.dispatch import receiver

from api.dto.product_type import ProductTypeDTO
from api.models.category import Category
from api.models.intl import IntlText


class ProductType(models.Model):
    image = models.FileField(upload_to="product_types/", null=True, blank=True)
    category = models.ForeignKey(Category, related_name="product_types",
                                 related_query_name="product_types", on_delete=models.CASCADE)

    def to_dto(self, intl_texts_to_dto=True):
        names = [
            name.to_dto() if intl_texts_to_dto else name.pk
            for name in self.names.order_by('language_id').all()
        ]
        descriptions = [
            description.to_dto() if intl_texts_to_dto else description.pk
            for description in self.descriptions.order_by('language_id').all()
        ]
        short_descriptions = [
            short_description.to_dto() if intl_texts_to_dto else short_description.pk
            for short_description in self.short_descriptions.order_by('language_id').all()
        ]
        feature_values = [
            feature_value.to_dto() for feature_value in self.feature_values.order_by('id').all()
        ]

        return ProductTypeDTO(
            self.pk,
            names,
            descriptions,
            short_descriptions,
            self.image,
            self.category.to_dto(),
            feature_values
        )

    class Meta:
        db_table = 'api_product_type'


@receiver(models.signals.post_delete, sender=ProductType)
def post_delete_handler(sender, **kwargs):
    product_type = kwargs['instance']
    storage, path = product_type.image.storage, product_type.image.path
    storage.delete(path)
