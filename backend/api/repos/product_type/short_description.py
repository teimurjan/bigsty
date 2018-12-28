from api.models import ProductTypeShortDescription
from api.repos.base import Repo


class ProductTypeShortDescriptionRepo(Repo):
    def __init__(self):
        super().__init__(ProductTypeShortDescription)

    def create(self, language_id, value, product_type):
        short_description = super()._create(
            language_id=language_id,
            value=value,
            product_type_id=product_type.id
        )
        product_type.short_descriptions.append(short_description)

    def update(self, short_description, value):
        self.model_cls.objects.filter(
            language_id=short_description.language.id,
            product_type_id=short_description.product_type.id
        ).update(value=value)
        short_description.value = value
