from django.db import models


class Permission(models.Model):
  name = models.CharField(max_length=60, unique=True, blank=False, null=False)

  class Meta:
    db_table = 'api_user_permission'


class Group(models.Model):
  name = models.CharField(max_length=60, unique=True, blank=False, null=False)
  permissions = models.ManyToManyField(Permission)

  class Meta:
    db_table = 'api_user_group'


class User(models.Model):
  email = models.EmailField(unique=True, blank=False, null=False)
  name = models.CharField(max_length=60, blank=False, null=False)
  date_joined = models.DateTimeField(auto_now_add=True)
  password = models.CharField(max_length=255, blank=False, null=False)
  group = models.ForeignKey(Group)

  def to_dict(self):
    return {
      'id': self.pk,
      'email': self.email,
      'name': self.name,
      'group': self.group.name
    }

  def __str__(self):
    return self.email


class Category(models.Model):
  name = models.CharField(unique=True, max_length=255)

  def to_dict(self):
    return {'id': self.pk, 'name': self.name}

  def __str__(self):
    return self.name


class Product(models.Model):
  name = models.CharField(max_length=255)
  description = models.CharField(max_length=1000, blank=True)
  short_description = models.CharField(max_length=100, blank=True)
  image = models.FileField(upload_to="store/static/images/products/main/", null=False)
  discount = models.IntegerField(default=0)
  price = models.IntegerField(null=False, blank=False)
  quantity = models.IntegerField(null=False, blank=False, default=0)
  category = models.ForeignKey(Category)

  def is_available(self):
    return int(self.quantity) > 0

  def to_dict(self):
    return {'id': self.id, 'name': self.name,
            'description': self.description, 'short_description': self.short_description,
            'image': self.image.url, 'discount': self.discount,
            'price': self.price, 'is_available': self.is_available(),
            'category': self.category.name}

  def __str__(self):
    return self.name


class ProductImage(models.Model):
  file = models.FileField(upload_to="store/static/images/products/")
  product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)

  class Meta:
    db_table = 'api_product_image'

  def __str__(self):
    return self.file.name
