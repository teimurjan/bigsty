from django.db import models
from django.dispatch import receiver

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


@receiver(models.signals.post_delete, sender=ProductImage)
def post_delete_handler(sender, **kwargs):
    product_image = kwargs['instance']
    storage, path = product_image.image.storage, product_image.image.path
    storage.delete(path)
