from api.models import ProductTypeName
from api.repos.base import Repo


class ProductTypeNameRepo(Repo):
    def __init__(self):
        super().__init__(ProductTypeName)

    def create(self, language_id, value, product_type):
        name = super()._create(
            language_id=language_id,
            value=value,
            product_type_id=product_type.id
        )
        product_type.names.append(name)

    def update(self, name, value):
        self.model_cls.objects.filter(
            language_id=name.language.id,
            product_type_id=name.product_type.id
        ).update(value=value)
        name.value = value
