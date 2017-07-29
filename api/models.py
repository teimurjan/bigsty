from django.db import models
from django.db.models.fields.files import FieldFile


class BaseModel(models.Model):
  def to_dict(self, exclude=list(), serialize=list()):
    return_dict = {}
    fields = self._meta.get_fields()
    for field in fields:
      field_name = self.__get_field_name(field)
      if field.is_relation and field_name not in exclude:
        return_dict[field_name] = self._get_related_field(field, field_name in serialize)
      elif field_name not in exclude:
        return_dict[field_name] = self._get_field(getattr(self, field_name))
    return return_dict

  def _get_related_field(self, field, should_serialize):
    if field.one_to_many or field.many_to_many:
      related_items = getattr(self, self.__get_field_name(field)).all()
      return [related_item.to_dict() for related_item in related_items] \
        if should_serialize else [field_item.pk for field_item in related_items]
    elif field.many_to_one:
      field_item = getattr(self, self.__get_field_name(field))
      return field_item.to_dict() if should_serialize else field_item.pk

  def __get_field_name(self, field):
    try:
      return field.related_name
    except AttributeError:
      return field.name

  def _get_field(self, field_value):
    if isinstance(field_value, FieldFile):
      return field_value.url if field_value else None
    return field_value

  class Meta:
    abstract = True


class Group(BaseModel):
  name = models.CharField(max_length=60, unique=True, blank=False, null=False)

  class Meta:
    db_table = 'api_user_group'


class Permission(BaseModel):
  name = models.CharField(max_length=60, unique=True, blank=False, null=False)
  groups = models.ManyToManyField(Group, related_name='permissions', related_query_name=' permission',
                                  db_table='api_user_permission_x_group')

  class Meta:
    db_table = 'api_user_permission'


class User(BaseModel):
  email = models.EmailField(unique=True, blank=False, null=False)
  name = models.CharField(max_length=60, blank=False, null=False)
  date_joined = models.DateTimeField(auto_now_add=True)
  password = models.CharField(max_length=255, blank=False, null=False)
  group = models.ForeignKey(Group, related_name='group')

  def to_dict(self, exclude=list(), relations=list()):
    exclude.append('password')
    return super().to_dict(exclude, relations)

  def _get_field(self, field_value):
    from datetime import datetime
    if isinstance(field_value, datetime):
      return field_value.__str__()
    return super()._get_field(field_value)

  def __str__(self):
    return self.email


class Category(BaseModel):
  name = models.CharField(unique=True, max_length=255)

  def __str__(self):
    return self.name


class ProductType(BaseModel):
  name = models.CharField(unique=True, max_length=255)
  description = models.CharField(max_length=1000, blank=True)
  short_description = models.CharField(max_length=100, blank=True)
  image = models.FileField(upload_to="store/static/images/products/main/", null=True, blank=True)
  category = models.ForeignKey(Category, related_name="product_types",
                               related_query_name="product_type")

  def __str__(self):
    return self.name

  class Meta:
    db_table = 'api_product_type'


class Product(BaseModel):
  discount = models.IntegerField(default=0)
  price = models.IntegerField(null=False, blank=False)
  quantity = models.IntegerField(null=False, blank=False, default=0)
  product_type = models.ForeignKey(ProductType, null=True, related_name='products', related_query_name='product')

  def is_available(self):
    return int(self.quantity) > 0


class FeatureType(BaseModel):
  name = models.CharField(max_length=100)
  categories = models.ManyToManyField(Category, related_name='feature_types',
                                      related_query_name='feature_type', db_table='api_feature_type_x_category')

  class Meta:
    db_table = 'api_feature_type'


class FeatureValue(BaseModel):
  name = models.CharField(max_length=100)
  feature_type = models.ForeignKey(FeatureType, related_name='feature_type')
  product_types = models.ManyToManyField(ProductType, related_name='feature_values', related_query_name='feature_value',
                                         db_table='api_feature_value_x_product_type')
  products = models.ManyToManyField(Product, related_name='feature_values', related_query_name='feature_value',
                                    db_table='api_feature_value_x_product')

  class Meta:
    db_table = 'api_feature_value'


class ProductImage(BaseModel):
  file = models.FileField(upload_to="store/static/images/products/")
  product = models.ForeignKey(Product, related_name="product", on_delete=models.CASCADE)

  class Meta:
    db_table = 'api_product_image'

  def __str__(self):
    return self.file.name
