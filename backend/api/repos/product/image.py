from api.models import ProductImage
from api.repos.base import Repo
from api.utils.image import base64_to_image


class ProductImageRepo(Repo):
    def __init__(self):
        super().__init__(ProductImage)

