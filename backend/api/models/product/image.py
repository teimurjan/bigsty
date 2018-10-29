from django.db import models

from api.dto.product.image import ProductImageDTO
from api.models.product import Product


class ProductImage(models.Model):
    image = models.FileField(upload_to="products")
    product = models.ForeignKey(
        Product, related_name="images", related_query_name='image', on_delete=models.CASCADE)

    def to_dto(self):
        return ProductImageDTO(self.pk, self.image, self.product.pk)

    class Meta:
        db_table = 'api_product_image'
