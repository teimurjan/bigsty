from api.models import ProductImage
from api.repos.base import Repo
from api.utils.image import base64_to_image


class ProductImageRepo(Repo):
    def __init__(self):
        super().__init__(ProductImage)

    def create(self, product, image):
        product.images.append(
            super()._create(product_id=product.id, image=image)
        )

    def delete_all_for_product(self, product):
        self.model_cls.objects.filter(product_id=product.id).delete()
        product.images = []