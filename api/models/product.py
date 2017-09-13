from django.db import models

from api.models.base import BaseModel
from api.models.product_type import ProductType


class Product(BaseModel):
  discount = models.IntegerField(default=0)
  price = models.IntegerField(null=False, blank=False)
  quantity = models.IntegerField(null=False, blank=False, default=0)
  product_type = models.ForeignKey(ProductType, null=True, related_name='products', related_query_name='product')

  def is_available(self):
    return int(self.quantity) > 0


class ProductImage(BaseModel):
  file = models.FileField(upload_to="store/static/images/products/")
  product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)

  class Meta:
    db_table = 'api_product_image'

  def __str__(self):
    return self.file.name
