from api.models import ProductTypeDescription
from api.repos.base import Repo


class ProductTypeDescriptionRepo(Repo):
    def __init__(self):
        super().__init__(ProductTypeDescription)

    def create(self, language_id, value, product_type):
        description = super()._create(
            language_id=language_id,
            value=value,
            product_type_id=product_type.id
        )
        product_type.descriptions.append(description)

    def update(self, description, value):
        self.model_cls.objects.filter(
            language_id=description.language.id,
            product_type_id=description.product_type.id
        ).update(value=value)
        description.value = value
