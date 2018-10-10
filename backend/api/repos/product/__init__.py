from api.models import Product, ProductImage
from api.repos.base import Repo


class ProductRepo(Repo):
    def __init__(self):
        super().__init__(Product)
